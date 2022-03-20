import { IPC_MANGO_RUN_CHANNEL } from 'ipc/channels'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { MangoMessage, PlainMangoAccount } from '../../ipc/mango'

interface IMangoContext {
  accounts: PlainMangoAccount[] | null
  selected: PlainMangoAccount | null
  onRefreshAccounts: () => void
  onSelectAccount: (account: PlainMangoAccount) => void
}

const MangoContext = createContext<IMangoContext>({} as any)

export function MangoContextProvider({ children }: { children: any }) {
  const { ipc } = window.electron
  const [accounts, setAccounts] = useState<PlainMangoAccount[] | null>(null)
  const [selected, setSelected] = useState<PlainMangoAccount | null>(null)

  const messageHandler = useCallback(
    (message: MangoMessage) => {
      switch (message.type) {
        case 'account-fetched': {
          setAccounts(message.payload.accounts.sort((a, b) => a.index - b.index))
          break
        }
        case 'account-changed': {
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
      type: 'fetch-account-list',
    })
  }, [ipc])

  const onSelectAccount = useCallback(
    (account: PlainMangoAccount) => {
      ipc.send(IPC_MANGO_RUN_CHANNEL, {
        type: 'set-account',
        payload: { index: account.index },
      })
    },
    [ipc]
  )
  return (
    <MangoContext.Provider
      value={{
        accounts,
        selected,
        onRefreshAccounts,
        onSelectAccount,
      }}
    >
      {children}
    </MangoContext.Provider>
  )
}

export function useMangoContext() {
  return useContext(MangoContext)
}
