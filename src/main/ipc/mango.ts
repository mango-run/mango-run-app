import { IpcMain } from 'electron'
import {
  Config,
  getMarketByBaseSymbolAndKind,
  IDS,
  MangoAccount,
  MangoClient,
} from '@blockworks-foundation/mango-client'
import { Bot, ConsoleLogger, MangoPerpMarket, NaiveGridSignal } from '@mango-run/core'
import { Connection } from '@solana/web3.js'
import { IPC_MANGO_RUN_CHANNEL } from '../../ipc/channels'
import { mustGetKeypair } from './solana'

async function initMain(ipcMain: IpcMain) {
  const keypair = mustGetKeypair()

  const groupConfig = new Config(IDS).getGroup('mainnet', 'mainnet.1')
  if (!groupConfig) throw new Error('not found mango group config')

  const connection = new Connection('https://ssc-dao.genesysgo.net')

  const mangoClient = new MangoClient(connection, groupConfig.mangoProgramId)

  const mangoGroup = await mangoClient.getMangoGroup(groupConfig.publicKey)

  const mangoCache = await mangoGroup.loadCache(connection)

  let accounts: MangoAccount[] = []

  let account: MangoAccount | null = null

  let bot: Bot | undefined

  ipcMain.on(IPC_MANGO_RUN_CHANNEL, async (e, message) => {
    switch (message.type) {
      case 'fetch-account-list': {
        accounts = await mangoClient.getMangoAccountsForOwner(mangoGroup, keypair.publicKey)

        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'account-fetched',
          payload: {
            accounts: accounts.map((a, index) => ({ index, name: a.name })),
          },
        })
        break
      }

      case 'set-account': {
        account = accounts[message.payload.index] || null

        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'account-changed',
          payload: {
            account: { index: message.payload.index, name: account.name },
          },
        })
        break
      }

      case 'start-grid-bot': {
        if (!account) break
        if (bot) break
        const logger = new ConsoleLogger()
        const marketConfig = getMarketByBaseSymbolAndKind(groupConfig, message.payload.config.baseSymbol, 'perp')
        const perpMarket = await mangoGroup.loadPerpMarket(
          connection,
          marketConfig.marketIndex,
          marketConfig.baseDecimals,
          marketConfig.quoteDecimals
        )
        const market = new MangoPerpMarket(
          {
            keypair,
            connection,
            mangoAccount: account,
            mangoCache,
            mangoClient,
            mangoGroup,
            marketConfig,
            perpMarket,
          },
          logger
        )
        const signal = new NaiveGridSignal(
          {
            market,
            priceLowerCap: message.payload.config.priceLowerCap,
            priceUpperCap: message.payload.config.priceUpperCap,
            gridCount: message.payload.config.gridCount,
            orderSize: message.payload.config.orderSize,
          },
          logger
        )
        bot = new Bot(market, signal, logger)
        await bot.start()
        e.sender.send(IPC_MANGO_RUN_CHANNEL, { type: 'grid-bot-started' })
        break
      }

      case 'stop-grid-bot': {
        if (!bot) break
        await bot.stop()
        e.sender.send(IPC_MANGO_RUN_CHANNEL, { type: 'grid-bot-stopped' })
        break
      }

      default: {
        console.log('unhandled payload', message)
        break
      }
    }
  })
}

export default {
  initMain,
}
