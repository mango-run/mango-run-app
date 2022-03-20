import { useCallback, useEffect, useState } from 'react'
import { IPC_MANGO_RUN_CHANNEL } from '../../ipc/channels'
import { MangoMessage, PlainMangoAccount } from '../../ipc/mango'

export default function useMangoRun() {
  const { ipc } = window.electron
  const [accounts, setAccounts] = useState<PlainMangoAccount[] | null>(null)
  const [selected, setSelected] = useState<PlainMangoAccount | null>(null)

  const messageHandler = useCallback(
    (message: MangoMessage) => {
      if (message.type === 'account-fetched') {
        setAccounts(message.payload.accounts.sort((a, b) => a.index - b.index))
      } else if (message.type === 'account-changed') {
        setSelected(message.payload.account)
      }
    },
    [setAccounts, setSelected]
  )

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

  return {
    accounts,
    selected,
    onRefreshAccounts,
    onSelectAccount,
  }
}
