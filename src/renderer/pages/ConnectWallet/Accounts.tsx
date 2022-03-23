import { useEffect } from 'react'
import { Spin } from 'antd'
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMangoContext } from '../../contexts/mango'

export default function Accounts() {
  const { onRefreshAccounts, onSelectAccount, accounts, selectedAccount } = useMangoContext()

  useEffect(() => {
    if (!accounts) {
      onRefreshAccounts()
    }
  })

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
              className={`mb-2 px-4 py-2 rounded cursor-pointer border flex flex-row items-center justify-between hover:bg-bg3 ${
                selectedAccount?.index === account.index ? 'border-green bg-bg3' : 'border-transparent bg-bg1'
              }`}
            >
              {account.name}{' '}
              {selectedAccount?.index === account.index && <CheckCircleOutlined className="text-green" />}
            </div>
          ))}
        </div>
      </Spin>
    </div>
  )
}
