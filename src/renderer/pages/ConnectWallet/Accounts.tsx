import { useEffect } from 'react'
import { Spin } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import useMangoRun from '../../hooks/useMangoRun'

export default function Accounts() {
  const { onRefreshAccounts, onSelectAccount, accounts, selected } = useMangoRun()

  useEffect(() => {
    onRefreshAccounts()
  }, [onRefreshAccounts])

  return (
    <div className="flex flex-row items-center justify-center w-full">
      <Spin spinning={!accounts}>
        <div className="w-96 mt-4 bg-bg2 rounded px-4 py-4 text-sm">
          <div className="flex flex-row items-center justify-between mb-2">
            <div>Mango Accounts</div>
            <ReloadOutlined onClick={onRefreshAccounts} className="cursor-pointer p-1" />
          </div>
          {accounts?.map((account) => (
            <div
              key={account.index}
              onClick={() => onSelectAccount(account)}
              className={`mb-2 px-4 py-2 rounded cursor-pointer border ${
                selected?.index === account.index ? 'border-transparent bg-bg3' : 'border-bg3'
              }`}
            >
              {account.name}
            </div>
          ))}
        </div>
      </Spin>
    </div>
  )
}
