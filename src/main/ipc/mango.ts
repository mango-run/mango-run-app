import { IpcMain } from 'electron'
import { IPC_MANGO_RUN_CHANNEL } from '../../ipc/channels'
import mangoBotManager from '../mango/mango-bot-manager'
import { getKeypair } from './solana'

async function initMain(ipcMain: IpcMain) {
  ipcMain.on(IPC_MANGO_RUN_CHANNEL, async (e, message) => {
    if (message.type !== 'get-bot-status') {
      console.info('on receive ipc message:', message)
    }
    switch (message.type) {
      case 'fetch-accounts': {
        const kp = getKeypair()
        if (!kp) {
          return
        }
        await mangoBotManager.initAccount(kp)
        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'accounts-changed',
          payload: { accounts: mangoBotManager.getMangoAccounts() },
        })
        return
      }

      case 'get-bot-status': {
        const { symbol } = message.payload
        e.returnValue = {
          orders: mangoBotManager.getReceipts(symbol),
          balances: await mangoBotManager.getBalances(),
          isRunning: mangoBotManager.isBotRunning(symbol),
          config: mangoBotManager.getConfig(symbol),
        }
        return
      }

      case 'select-account': {
        const { index } = message.payload
        mangoBotManager.selectAccount(index)
        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'account-selected',
          payload: { account: { index, name: mangoBotManager.mangoAccount?.name ?? '' } },
        })
        break
      }

      case 'start-grid-bot': {
        await mangoBotManager.startBot(message.payload.config)
        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'grid-bot-started',
          payload: { config: message.payload.config },
        })
        return
      }

      case 'stop-grid-bot': {
        await mangoBotManager.stopBot(message.payload.symbol)
        e.sender.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'grid-bot-stopped',
        })
        return
      }

      default: {
        console.error('unhandled payload', message)
      }
    }
  })
}

export default {
  initMain,
}
