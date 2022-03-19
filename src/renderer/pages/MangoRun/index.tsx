import { IPC_MANGO_RUN_CHANNEL } from 'ipc/channels'
import { MangoMessage, PlainMangoAccount } from 'ipc/mango'
import { useCallback, useEffect, useState } from 'react'
import { Spin } from 'antd'
import Button from '../../components/Button'

export default function MangoRun() {
  const { ipc } = window.electron

  const [accounts, setAccounts] = useState<PlainMangoAccount[] | null>(null)
  const [selected, setSelected] = useState<PlainMangoAccount | null>(null)

  const onRefreshAccounts = useCallback(() => {
    ipc.set(IPC_MANGO_RUN_CHANNEL, {
      type: 'fetch-account-list',
    })
  }, [ipc])

  const onSelectAccount = useCallback(
    (account: PlainMangoAccount) => {
      ipc.set(IPC_MANGO_RUN_CHANNEL, {
        type: 'set-account',
        payload: { index: account.index },
      })
    },
    [ipc]
  )

  const messageHandler = useCallback(
    (message: MangoMessage) => {
      if (message.type === 'account-fetched') {
        setAccounts(message.payload.accounts)
      } else if (message.type === 'account-changed') {
        setSelected(message.payload.account)
      }
    },
    [setAccounts, setSelected]
  )

  useEffect(() => {
    onRefreshAccounts()
    ipc.on(IPC_MANGO_RUN_CHANNEL, messageHandler)
    return () => ipc.off(IPC_MANGO_RUN_CHANNEL, messageHandler)
  }, [ipc, messageHandler, onRefreshAccounts])

  return (
    <div className="flex flex-row items-center justify-center w-full">
      <Spin spinning={!accounts}>
        <div className="w-96 mt-20 bg-bg2 rounded px-4 py-4 text-sm">
          Account list
          <ul>
            {accounts?.map((account) => (
              <li key={account.index} className="mb-2">
                <Button onClick={() => onSelectAccount(account)}>
                  {account.name}{' '}
                  {selected?.index === account.index && `(selected)`}
                </Button>
              </li>
            ))}
          </ul>
          <Button onClick={onRefreshAccounts}>Refresh</Button>
        </div>
      </Spin>
    </div>
  )
}
