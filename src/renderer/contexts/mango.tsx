import { IPC_MANGO_RUN_CHANNEL } from 'ipc/channels'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRecursiveTimeout } from '@funcblock/dapp-sdk'
import { GridBotConfig, MangoMessage, PlainMangoAccount } from '../../ipc/mango'

export interface IOrder {
  market: string
  side: 'Buy' | 'Sell'
  price: number
  size: number
  value: number
}

interface IMangoContext {
  accounts: PlainMangoAccount[] | null
  selected: PlainMangoAccount | null
  orders: IOrder[] | null
  onRefreshAccounts: () => void
  onSelectAccount: (account: PlainMangoAccount) => void
  onStartBot: (config: GridBotConfig) => void
  onStopBot: () => void
}

const MangoContext = createContext<IMangoContext>({} as never)

export function MangoContextProvider({ children }: { children: never }) {
  const { ipc } = window.electron
  const [accounts, setAccounts] = useState<PlainMangoAccount[] | null>(null)
  const [selected, setSelected] = useState<PlainMangoAccount | null>(null)
  const [orders, setOrders] = useState<IOrder[] | null>(null)

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
        default: {
          break
        }
      }
    },
    [setAccounts, setSelected]
  )

  useRecursiveTimeout(async () => {
    const receipts = ipc.get(IPC_MANGO_RUN_CHANNEL, { type: 'get-orders' })
    const newOrders: IOrder[] = receipts.map((i: any) => ({
      market: 'SOL',
      side: i.order.side === 0 ? 'Buy' : 'Sell',
      size: i.order.size,
      price: i.order.price,
      value: i.order.price * i.order.size,
    }))
    setOrders(newOrders)
  }, 3000)

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
