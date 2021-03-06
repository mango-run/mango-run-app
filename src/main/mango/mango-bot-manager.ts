import {
  Config,
  getMarketByBaseSymbolAndKind,
  GroupConfig,
  IDS,
  MangoAccount,
  MangoClient,
  MangoGroup,
} from '@blockworks-foundation/mango-client'
import { Connection, Keypair } from '@solana/web3.js'
import { Bot, ConsoleLogger, MangoPerpMarket, NaiveGridSignal, ReceiptStatus } from '@mango-run/core'
import { GridBotConfig } from '../../ipc/mango'

const logger = new ConsoleLogger()

class MangoBotManager {
  walletKeypair?: Keypair
  connection: Connection
  mangoGroupConfig: GroupConfig
  mangoClient: MangoClient
  mangoGroup!: MangoGroup
  mangoAccounts: MangoAccount[] = []
  mangoAccount?: MangoAccount
  bots: { [symbol: string]: Bot } = {}
  markets: { [symbol: string]: MangoPerpMarket } = {}
  configs: { [symbol: string]: GridBotConfig } = {}
  onError: (error: Error) => void = () => {}

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.mangoGroupConfig = new Config(IDS).getGroup('mainnet', 'mainnet.1')!
    this.connection = new Connection('https://solana-api.projectserum.com', {
      httpHeaders: {
        origin: 'https://trade.mango.markets',
        referer: 'https://trade.mango.markets/',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
      },
    })
    this.mangoClient = new MangoClient(this.connection, this.mangoGroupConfig.mangoProgramId)
  }

  setOnError(onError: (error: Error) => void) {
    this.onError = onError
  }

  async init() {
    this.mangoGroup = await this.mangoClient.getMangoGroup(this.mangoGroupConfig.publicKey)
  }

  async initAccount(keypair: Keypair) {
    this.walletKeypair = keypair
    this.mangoAccounts = await this.mangoClient.getMangoAccountsForOwner(this.mangoGroup, keypair.publicKey)
  }

  selectAccount(index: number) {
    this.mangoAccount = this.mangoAccounts[index]
  }

  async initMarket(symbol: string) {
    if (this.markets[symbol]) {
      return
    }
    if (!this.walletKeypair || !this.mangoAccount) {
      console.error('invaliad status, initMarket failed |', !this.walletKeypair, '|', !this.mangoAccount)
      return
    }
    console.log('initMarket:', symbol, this.walletKeypair.publicKey.toBase58(), this.mangoAccount.name)
    const mangoCache = await this.mangoGroup.loadCache(this.connection)
    const marketConfig = getMarketByBaseSymbolAndKind(this.mangoGroupConfig, symbol, 'perp')
    const perpMarket = await this.mangoGroup.loadPerpMarket(
      this.connection,
      marketConfig.marketIndex,
      marketConfig.baseDecimals,
      marketConfig.quoteDecimals
    )
    const market = new MangoPerpMarket(
      {
        keypair: this.walletKeypair,
        connection: this.connection,
        mangoAccount: this.mangoAccount,
        mangoCache,
        mangoClient: this.mangoClient,
        mangoGroup: this.mangoGroup,
        marketConfig,
        perpMarket,
      },
      logger
    )
    await market.initialize()
    this.markets[symbol] = market

    // error - the orignal error caught
    // details - the context description when occuring error
    market.on('error', ({ error, details }: any) => {
      console.error('market onError', error, details)
      this.onError(error)
    })
  }

  async startBot(config: GridBotConfig) {
    console.info('MangoBotManager | startBot')
    const symbol = config.baseSymbol
    const market = this.markets[symbol]
    if (!market) {
      throw new Error('Market is not initialized')
    }
    try {
      await market.cancelAllOrders()
    } catch (error) {
      console.error('cancelAllOrders failed', error)
    }
    const signal = new NaiveGridSignal(
      {
        market,
        priceLowerCap: config.priceLowerCap,
        priceUpperCap: config.priceUpperCap,
        gridCount: config.gridCount,
        orderSize: config.orderSize,
      },
      logger
    )
    const bot = new Bot(market, signal, logger)
    // bot status
    // BotStatus - { status, message }
    // status - status string ex: starting, stopping
    // message - status detail
    // bot.getBotStatus() -> BotStatus

    await bot.start()
    this.bots[symbol] = bot
    this.configs[symbol] = config
    console.info('start bot successfully')
  }

  async stopBot(symbol: string) {
    console.info('MangoBotManager | stopBot')
    const bot = this.bots[symbol]
    if (!bot) {
      console.error('no bot found for symbol:', symbol)
      return
    }
    await bot.stop()
    console.info('MangoBotManager | stop bot successfully')
    delete this.bots[symbol]
    delete this.markets[symbol]
    delete this.configs[symbol]
  }

  /**
   * Getters
   */

  getMangoAccounts() {
    return this.mangoAccounts.map((i, index) => ({ name: i.name, index }))
  }

  getReceipts(symbol: string) {
    return this.markets[symbol]?.receipts(
      ReceiptStatus.PlacePending,
      ReceiptStatus.CancelPending,
      ReceiptStatus.Placed,
      ReceiptStatus.Canceled
    )
  }

  getConfig(symbol: string) {
    return this.configs[symbol]
  }

  async getBalances() {
    const symbols = ['SOL']
    const balances = await Promise.all(
      symbols.map((i) => {
        this.initMarket(i).catch(console.error)
        return this.markets[i]?.balance()
      })
    )
    return symbols.map((i, index) => ({
      symbol: i,
      balance: balances[index],
    }))
  }

  isBotRunning(symbol: string) {
    return !!this.bots[symbol]
  }
}

const mangoBotManager = new MangoBotManager()
mangoBotManager.init().catch(console.error)
export default mangoBotManager
