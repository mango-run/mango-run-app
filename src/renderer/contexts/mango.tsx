import { IPC_MANGO_RUN_CHANNEL } from 'ipc/channels'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRecursiveTimeout } from '@funcblock/dapp-sdk'
import { GridBotConfig, MangoMessage, PlainMangoAccount } from '../../ipc/mango'
import useStore from '../hooks/useStore'

export interface IOrder {
  market: string
  side: 'Buy' | 'Sell'
  price: number
  size: number
  value: number
}

interface IMangoContext {
  accounts: PlainMangoAccount[] | null
  selectedAccount: PlainMangoAccount | null
  orders: IOrder[] | null
  isRunning: boolean
  config: GridBotConfig | null
  onRefreshAccounts: () => void
  onSelectAccount: (account: PlainMangoAccount) => void
  onStartBot: (config: GridBotConfig) => void
  onStopBot: () => void
}

const MangoContext = createContext<IMangoContext>({} as never)

export function MangoContextProvider({ children }: { children: any }) {
  const { ipc } = window.electron
  const [defaultAccountName, setDefaultAccountName] = useStore('SELECTED_MANGO_ACCOUNT_NAME')
  const [accounts, setAccounts] = useState<PlainMangoAccount[] | null>(null)
  const [selected, setSelected] = useState<PlainMangoAccount | null>(null)
  const [orders, setOrders] = useState<IOrder[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [config, setConfig] = useState<GridBotConfig | null>(null)

  const messageHandler = useCallback(
    (message: MangoMessage) => {
      console.info('On IPC mango message', message)
      switch (message.type) {
        case 'accounts-changed': {
          const newAccounts = message.payload.accounts
          setAccounts(newAccounts)
          const defaultAccount = newAccounts.find((i) => i.name === defaultAccountName)
          if (defaultAccount) {
            setSelected(defaultAccount)
          } else {
            setDefaultAccountName(undefined)
          }
          break
        }
        case 'account-selected': {
          setSelected(message.payload.account)
          setDefaultAccountName(message.payload.account.name)
          break
        }
        default: {
          break
        }
      }
    },
    [setAccounts, setSelected, setDefaultAccountName, defaultAccountName]
  )

  useRecursiveTimeout(async () => {
    const { receipts, isRunning, config } = (ipc.get(IPC_MANGO_RUN_CHANNEL, { type: 'get-bot-status' }) ?? {}) as {
      receipts: any[]
      isRunning: boolean
      config: GridBotConfig
    }
    setIsRunning(isRunning)
    setConfig(config)
    const newOrders: IOrder[] =
      receipts?.map((i: any) => ({
        market: 'SOL',
        side: i.order.side === 0 ? 'Buy' : 'Sell',
        size: i.order.size,
        price: i.order.price,
        value: i.order.price * i.order.size,
      })) ?? []
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
      setSelected(account)
      setDefaultAccountName(account.name)
      ipc.send(IPC_MANGO_RUN_CHANNEL, {
        type: 'select-account',
        payload: { index: account.index },
      })
    },
    [ipc, setSelected, setDefaultAccountName]
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
        selectedAccount: selected,
        orders,
        isRunning,
        config,
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
