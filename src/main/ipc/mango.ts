import { IpcMain } from 'electron'
import {
  Config,
  getMarketByBaseSymbolAndKind,
  IDS,
  MangoAccount,
  MangoClient,
} from '@blockworks-foundation/mango-client'
import { Bot, ConsoleLogger, MangoPerpMarket, NaiveGridSignal, ReceiptStatus } from '@mango-run/core'
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
  let bot: Bot | null = null
  const logger = new ConsoleLogger()
  const marketConfig = getMarketByBaseSymbolAndKind(groupConfig, 'SOL', 'perp')
  const perpMarket = await mangoGroup.loadPerpMarket(
    connection,
    marketConfig.marketIndex,
    marketConfig.baseDecimals,
    marketConfig.quoteDecimals
  )
  let market: MangoPerpMarket | null = null

  ipcMain.on(IPC_MANGO_RUN_CHANNEL, async (e, message) => {
    switch (message.type) {
      case 'fetch-accounts': {
        accounts = await mangoClient.getMangoAccountsForOwner(mangoGroup, keypair.publicKey)

        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'accounts-changed',
          payload: {
            accounts: accounts.map((a, index) => ({ index, name: a.name })),
          },
        })
        break
      }

      case 'fetch-orders': {
        e.sender.send(IPC_MANGO_RUN_CHANNEL, { type: 'orders-changed', orders: market?.receipts() ?? [] })
        break
      }

      case 'select-account': {
        account = accounts[message.payload.index] || null

        if (account) {
          market = new MangoPerpMarket(
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
          await market.initialize()
          e.sender.send(IPC_MANGO_RUN_CHANNEL, {
            type: 'orders-changed',
            payload: {
              orders: market.receipts(ReceiptStatus.Placed, ReceiptStatus.PlacePending) ?? [],
            },
          })
        }
        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'account-selected',
          payload: {
            account: { index: message.payload.index, name: account.name },
          },
        })
        break
      }

      case 'start-grid-bot': {
        if (bot || !account || !market) {
          console.error('invalid status to start bot')
          break
        }
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
        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'orders-changed',
          payload: {
            orders: market.receipts(ReceiptStatus.Placed, ReceiptStatus.PlacePending),
          },
        })
        break
      }

      case 'stop-grid-bot': {
        if (!bot) break
        await bot.stop()
        bot = null
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
