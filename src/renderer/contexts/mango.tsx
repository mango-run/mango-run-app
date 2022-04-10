import { IPC_MANGO_RUN_CHANNEL } from 'ipc/channels'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRecursiveTimeout } from '@funcblock/dapp-sdk'
import { notification } from 'antd'
import { GridBotConfig, MangoMessage, PlainMangoAccount } from '../../ipc/mango'
import useStore from '../hooks/useStore'

export interface IOrder {
  market: string
  side: 'Buy' | 'Sell'
  price: number
  size: number
  value: number
}

export interface IPosition {
  market: string
  side: 'Long' | 'Short'
  amount: number
}

interface IMangoContext {
  accounts?: PlainMangoAccount[]
  selectedAccount?: PlainMangoAccount
  orders?: IOrder[]
  positions?: IPosition[]
  isRunning?: boolean
  config?: GridBotConfig
  onRefreshAccounts: () => void
  onSelectAccount: (account: PlainMangoAccount) => void
  onStartBot: (config: GridBotConfig) => void
  onStopBot: () => void
}

const MangoContext = createContext<IMangoContext>({} as never)

export function MangoContextProvider({ children }: { children: any }) {
  const { ipc } = window.electron
  const [defaultAccountName, setDefaultAccountName] = useStore('SELECTED_MANGO_ACCOUNT_NAME')
  const [accounts, setAccounts] = useState<PlainMangoAccount[] | undefined>()
  const [selected, setSelected] = useState<PlainMangoAccount | undefined>()
  const [orders, setOrders] = useState<IOrder[] | undefined>()
  const [positions, setPositions] = useState<IPosition[] | undefined>()
  const [isRunning, setIsRunning] = useState<boolean | undefined>(false)
  const [config, setConfig] = useState<GridBotConfig | undefined>()

  const onSelectAccount = useCallback(
    (account?: PlainMangoAccount) => {
      setSelected(account)
      setDefaultAccountName(account?.name)
      if (account) {
        ipc.send(IPC_MANGO_RUN_CHANNEL, {
          type: 'select-account',
          payload: { index: account.index },
        })
      }
    },
    [ipc, setSelected, setDefaultAccountName]
  )

  const messageHandler = useCallback(
    (message: MangoMessage) => {
      console.info('On IPC mango message', message)
      switch (message.type) {
        case 'accounts-changed': {
          const newAccounts = message.payload.accounts
          setAccounts(newAccounts)
          const defaultAccount = newAccounts.find((i) => i.name === defaultAccountName)
          if (defaultAccount) {
            onSelectAccount(defaultAccount)
          } else {
            onSelectAccount(undefined)
          }
          break
        }
        case 'account-selected': {
          setSelected(message.payload.account)
          setDefaultAccountName(message.payload.account.name)
          break
        }
        case 'grid-bot-started': {
          setIsRunning(true)
          setConfig(message.payload.config)
          break
        }
        case 'grid-bot-stopped': {
          setIsRunning(false)
          setConfig(undefined)
          break
        }
        case 'on-error': {
          const { error } = message.payload
          console.error(error)
          notification.error({
            message: `Bot Error: ${error.name}`,
            description: error.message,
          })
          break
        }
        default: {
          break
        }
      }
    },
    [defaultAccountName, onSelectAccount, setDefaultAccountName]
  )

  useRecursiveTimeout(async () => {
    const { orders, balances } = (ipc.get(IPC_MANGO_RUN_CHANNEL, {
      type: 'get-bot-status',
      payload: { symbol: 'SOL' },
    }) ?? {}) as { orders: any[]; balances: any[] }
    const newOrders: IOrder[] =
      orders?.map((i: any) => ({
        market: 'SOL',
        side: i.order.side === 0 ? 'Buy' : 'Sell',
        size: i.order.size,
        price: i.order.price,
        value: i.order.price * i.order.size,
      })) ?? []
    setOrders(newOrders)
    const newPositions: IPosition[] = balances
      ?.filter((i) => !!i.balance)
      ?.map((i) => ({
        market: i.symbol,
        side: i.balance.base > 0 ? 'Long' : 'Short',
        amount: i.balance.base,
      }))
    setPositions(newPositions)
    console.log(balances)
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

  // fetch account on start
  useEffect(() => {
    ipc.send(IPC_MANGO_RUN_CHANNEL, {
      type: 'fetch-accounts',
    })
  }, [ipc])

  const onRefreshAccounts = useCallback(() => {
    setAccounts(undefined)
    ipc.send(IPC_MANGO_RUN_CHANNEL, {
      type: 'fetch-accounts',
    })
  }, [ipc])

  const onStartBot = useCallback(
    (config: GridBotConfig) => {
      console.info('start mango bot:', config)
      setIsRunning(undefined)
      ipc.send(IPC_MANGO_RUN_CHANNEL, {
        type: 'start-grid-bot',
        payload: { config },
      })
    },
    [ipc]
  )

  const onStopBot = useCallback(() => {
    console.info('stop mango bot')
    setIsRunning(undefined)
    ipc.send(IPC_MANGO_RUN_CHANNEL, {
      type: 'stop-grid-bot',
      payload: { symbol: 'SOL' },
    })
  }, [ipc])

  return (
    <MangoContext.Provider
      value={{
        accounts,
        selectedAccount: selected,
        orders,
        positions,
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
