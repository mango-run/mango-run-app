import { IpcMain } from 'electron'
import Store from 'electron-store'
import base58 from 'bs58'
import {
  MangoMarketConfigs,
  MangoMarket,
  ConsoleLogger,
  GridSignalConfigs,
  NaiveGridSignal,
  Bot,
} from '@mango-run/core'
import { Keypair } from '@solana/web3.js'
import { IPC_MANGO_START_BOT, IPC_MANGO_GET_BOT } from '../../ipc/channels'
import { getAccount, getPrivateKey } from './solana'

interface GridBotArgs {
  privateKey: string
  baseSymbol: string
  marketKind: 'perp'
  priceUpperCap: number
  priceLowerCap: number
  gridCount: number
  gridActiveRange?: number
  orderSize: number
  startPrice?: number
  stopLossPrice?: number
  takeProfitPrice?: number
}

let bot: Bot | undefined

async function startBot(args: GridBotArgs) {
  const marketConfigs: MangoMarketConfigs = {
    keypair: Keypair.fromSecretKey(base58.decode(args.privateKey)),
    symbol: args.baseSymbol,
    kind: args.marketKind,
  }

  const logger = new ConsoleLogger()
  const market = new MangoMarket(marketConfigs, logger)
  market.initialize()

  const mangoAccounts = await market.subAccounts()
  if (!mangoAccounts.length) {
    logger.info('please create mango account first')
    return
  }

  market.setSubAccountIndex(mangoAccounts[0])

  const signalConfigs: GridSignalConfigs = {
    market,
    priceUpperCap: args.priceUpperCap,
    priceLowerCap: args.priceLowerCap,
    gridCount: args.gridCount,
    orderSize: args.orderSize,
    gridActiveRange: args.gridActiveRange,
    startPrice: args.startPrice,
    stopLossPrice: args.stopLossPrice,
    takeProfitPrice: args.takeProfitPrice,
  }
  const signal = new NaiveGridSignal(signalConfigs, logger)

  bot = new Bot(market, signal, logger)
  bot.start()
}

async function initMain(ipcMain: IpcMain) {
  ipcMain.on(
    IPC_MANGO_START_BOT,
    async (_, { args }: { args: GridBotArgs }) => {
      const pk = getPrivateKey()
      if (!pk) {
        return
      }
      args.privateKey = pk
      await startBot(args)
    }
  )

  ipcMain.on(IPC_MANGO_GET_BOT, async (event) => {
    event.returnValue = bot
  })
}

export default {
  initMain,
}
