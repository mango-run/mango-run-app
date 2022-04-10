import { IPC_MANGO_RUN_CHANNEL } from './channels'

export interface GridBotConfig {
  baseSymbol: string
  priceUpperCap: number
  priceLowerCap: number
  gridCount: number
  orderSize: number
}

export interface PlainMangoAccount {
  index: number
  name: string
}

export type MangoMessage =
  | { type: 'fetch-accounts' }
  | { type: 'accounts-changed'; payload: { accounts: PlainMangoAccount[] } }
  | { type: 'select-account'; payload: { index: number } }
  | { type: 'account-selected'; payload: { account: PlainMangoAccount } }
  | { type: 'get-bot-status'; payload: { symbol: string } }
  | { type: 'start-grid-bot'; payload: { config: GridBotConfig } }
  | { type: 'grid-bot-started'; payload: { config: GridBotConfig } }
  | { type: 'stop-grid-bot'; payload: { symbol: string } }
  | { type: 'grid-bot-stopped' }
  | { type: 'on-error'; payload: { error: Error } }

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
