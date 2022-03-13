import { createContext, useCallback, useContext } from 'react'
import { IPC_MANGO_START_BOT } from 'ipc/channels'

interface GridBotArgs {
  publicKey: string
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

interface IDashboardContext {
  startBot: (args: GridBotArgs) => void
}

export const DashboardContext = createContext<IDashboardContext>(
  {} as IDashboardContext
)

export function useDashboardContext(): IDashboardContext {
  return useContext(DashboardContext)
}

export function DashboardContextProvider({ children }: { children: any }) {
  const { ipc } = window.electron

  const startBot = useCallback(
    (args: GridBotArgs) => {
      ipc.set(IPC_MANGO_START_BOT, { args })
    },
    [ipc]
  )
  return (
    <DashboardContext.Provider
      value={{
        startBot,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
