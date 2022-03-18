import { IPC_MANGO_RUN_CHANNEL } from 'ipc/channels'
import { MangoMessage, PlainMangoAccount } from 'ipc/mango'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'

export default function MangoRun() {
  const [accounts, setAccounts] = useState<PlainMangoAccount[]>([])

  const [selected, setSelected] = useState<PlainMangoAccount | null>(null)

  useEffect(() => {
    window.electron.ipc.set(IPC_MANGO_RUN_CHANNEL, {
      type: 'fetch-account-list',
    })

    function messageHandler(message: MangoMessage) {
      if (message.type === 'account-fetched') {
        setAccounts(message.payload.accounts)
      } else if (message.type === 'account-changed') {
        setSelected(message.payload.account)
      }
    }

    window.electron.ipc.on(IPC_MANGO_RUN_CHANNEL, messageHandler)

    return () => window.electron.ipc.off(IPC_MANGO_RUN_CHANNEL, messageHandler)
  }, [])

  return (
    <div className="flex flex-row items-center justify-center w-full">
      <div className="w-96 mt-20 bg-bg2 rounded px-4 py-4 text-sm">
        Account list
        <ul>
          {accounts.map((account) => (
            <li key={account.index} className="mb-2">
              <Button
                onClick={() =>
                  window.electron.ipc.set(IPC_MANGO_RUN_CHANNEL, {
                    type: 'set-account',
                    payload: { index: account.index },
                  })
                }
              >
                {account.name}{' '}
                {selected?.index === account.index && `(selected)`}
              </Button>
            </li>
          ))}
        </ul>
        <Button
          onClick={() =>
            window.electron.ipc.set(IPC_MANGO_RUN_CHANNEL, {
              type: 'fetch-account-list',
            })
          }
        >
          Refresh
        </Button>
      </div>
    </div>
  )
}
