import { IPC_MANGO_RUN_CHANNEL } from 'ipc/channels'
import { Receipt } from '@mango-run/core'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { GridBotConfig, MangoMessage, PlainMangoAccount } from '../../ipc/mango'

interface IMangoContext {
  accounts: PlainMangoAccount[] | null
  selected: PlainMangoAccount | null
  orders: any[] | null
  onRefreshAccounts: () => void
  onSelectAccount: (account: PlainMangoAccount) => void
  onStartBot: (config: GridBotConfig) => void
  onStopBot: () => void
}

const MangoContext = createContext<IMangoContext>({} as any)

export function MangoContextProvider({ children }: { children: any }) {
  const { ipc } = window.electron
  const [accounts, setAccounts] = useState<PlainMangoAccount[] | null>(null)
  const [selected, setSelected] = useState<PlainMangoAccount | null>(null)
  const [orders, setOrders] = useState<Receipt[] | null>(null)

  const messageHandler = useCallback(
    (message: MangoMessage) => {
      console.info('On IPC mango message', message)
      switch (message.type) {
        case 'accounts-changed': {
          setAccounts(message.payload.accounts.sort((a, b) => a.index - b.index))
          break
        }
        case 'account-selected': {
          setSelected(message.payload.account)
          break
        }
        case 'orders-changed': {
          setOrders(message.payload.orders)
          break
        }
        default: {
          break
        }
      }
    },
    [setAccounts, setSelected, setOrders]
  )

  // subscribe MangoRun channel
  useEffect(() => {
    if (messageHandler) {
      ipc.on(IPC_MANGO_RUN_CHANNEL, messageHandler)
    }
    return () => {
      if (messageHandler) {
        ipc.off(IPC_MANGO_RUN_CHANNEL, messageHandler)
      }
    }
  }, [ipc, messageHandler])

  const onRefreshAccounts = useCallback(() => {
    setAccounts(null)
    ipc.send(IPC_MANGO_RUN_CHANNEL, {
      type: 'fetch-accounts',
    })
  }, [ipc])

  const onSelectAccount = useCallback(
    (account: PlainMangoAccount) => {
      ipc.send(IPC_MANGO_RUN_CHANNEL, {
        type: 'select-account',
        payload: { index: account.index },
      })
    },
    [ipc]
  )

  const onStartBot = useCallback(
    (config: GridBotConfig) => {
      console.info('start mango bot:', config)
      ipc.send(IPC_MANGO_RUN_CHANNEL, {
        type: 'start-grid-bot',
        payload: { config },
      })
    },
    [ipc]
  )

  const onStopBot = useCallback(() => {
    console.info('stop mango bot')
    ipc.send(IPC_MANGO_RUN_CHANNEL, {
      type: 'stop-grid-bot',
      payload: {},
    })
  }, [ipc])

  return (
    <MangoContext.Provider
      value={{
        accounts,
        selected,
        orders,
        onRefreshAccounts,
        onSelectAccount,
        onStartBot,
        onStopBot,
      }}
    >
      {children}
    </MangoContext.Provider>
  )
}

export function useMangoContext() {
  return useContext(MangoContext)
}
