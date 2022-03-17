export const IPC_MANGO_RUN_CHANNEL = 'IPC_MANGO_RUN_CHANNEL'

export interface GridBotConfigs {
  baseSymbol: string
  priceUpperCap: number
  priceLowerCap: number
  gridCount: number
  orderSize: number
}

export type MangoMessage =
  | { type: 'fetch-account-list' }
  | { type: 'set-account'; payload: { index: number } }
  | { type: 'account-fetched'; payload: { accounts: PlainMangoAccount[] } }
  | { type: 'start-grid-bot'; payload: { config: GridBotConfigs } }
  | { type: 'stop-grid-bot' }
  | { type: 'grid-bot-started' }
  | { type: 'grid-bot-stoppted' }
  | { type: 'account-changed'; payload: { account: PlainMangoAccount | null } }

export interface PlainMangoAccount {
  index: number
  name: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Electron {
    interface IpcMain {
      on(
        channel: typeof IPC_MANGO_RUN_CHANNEL,
        listener: (event: IpcMainEvent, message: MangoMessage) => void
      ): this
    }

    interface WebContents {
      send(channel: typeof IPC_MANGO_RUN_CHANNEL, message: MangoMessage): void
    }
  }
}
