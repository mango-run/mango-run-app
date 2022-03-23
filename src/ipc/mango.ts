import { IPC_MANGO_RUN_CHANNEL } from './channels'

export interface GridBotConfig {
  baseSymbol: string
  priceUpperCap: number
  priceLowerCap: number
  gridCount: number
  orderSize: number
}

export type MangoMessage =
  | { type: 'fetch-accounts' }
  | { type: 'accounts-changed'; payload: { accounts: PlainMangoAccount[] } }
  | { type: 'select-account'; payload: { index: number } }
  | { type: 'account-selected'; payload: { account: PlainMangoAccount } }
  | { type: 'start-grid-bot'; payload: { config: GridBotConfig } }
  | { type: 'grid-bot-started' }
  | { type: 'stop-grid-bot' }
  | { type: 'grid-bot-stoppted' }
  | { type: 'get-orders' }

export interface PlainMangoAccount {
  index: number
  name: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Electron {
    interface IpcMain {
      on(channel: typeof IPC_MANGO_RUN_CHANNEL, listener: (event: IpcMainEvent, message: MangoMessage) => void): this
    }

    interface WebContents {
      send(channel: typeof IPC_MANGO_RUN_CHANNEL, message: MangoMessage): void
    }
  }
}
