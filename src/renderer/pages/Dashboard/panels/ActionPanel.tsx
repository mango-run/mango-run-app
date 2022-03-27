import { Input, Select } from 'antd'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSolanaContext } from 'renderer/contexts/solana'
import { formatAmount } from '@funcblock/dapp-sdk'
import Button from '../../../components/Button'
import { useMangoContext } from '../../../contexts/mango'
import { GridBotConfig } from '../../../../ipc/mango'

export default function ActionPanel() {
  const navigate = useNavigate()
  const { onStartBot, onStopBot, isRunning, config, selectedAccount } = useMangoContext()
  const { wallet } = useSolanaContext()
  const [baseSymbol, setBaseSymbol] = useState('SOL')
  const [priceUpperCap, setPriceUpperCap] = useState('')
  const [priceLowerCap, setPriceLowerCap] = useState('')
  const [gridCount, setGridCount] = useState('')
  const [totalAmount, setTotalAmount] = useState('')

  const onSubmit = useCallback(async () => {
    if (!wallet) {
      return
    }
    if (isRunning) {
      await onStopBot()
      return
    }
    const gridCountNumber = parseInt(gridCount, 10)
    const orderSize = parseFloat(totalAmount) / gridCountNumber
    const config: GridBotConfig = {
      baseSymbol,
      priceUpperCap: parseFloat(priceUpperCap),
      priceLowerCap: parseFloat(priceLowerCap),
      gridCount: parseFloat(gridCount),
      orderSize,
    }
    await onStartBot(config)
  }, [onStartBot, onStopBot, isRunning, wallet, baseSymbol, priceUpperCap, priceLowerCap, gridCount, totalAmount])

  return (
    <div>
      <div className="my-4 font-bold text-lg text-center">Grid Trading Bot</div>
      <div>
        <div className="mb-2">
          <Select className="w-full bg-bg-1" value={baseSymbol} onChange={(e) => setBaseSymbol(e)}>
            <Select.Option className="bg-bg-2">SOL</Select.Option>
          </Select>
        </div>
        <div className="mb-2 flex flex-row">
          <div className="flex-1 mr-4">
            <div className="mb-1">Lower Price</div>
            <Input
              className=""
              disabled={!!config}
              value={config?.priceLowerCap ?? priceLowerCap}
              onChange={(e) => setPriceLowerCap(e.target.value)}
            />
          </div>
          <div className="flex-1 ml-4">
            <div className="mb-1">Upper Price</div>
            <Input
              className=""
              disabled={!!config}
              value={config?.priceUpperCap ?? priceUpperCap}
              onChange={(e) => setPriceUpperCap(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-2">
          <div className="mb-1">Grids (2-50)</div>
          <Input
            className=""
            disabled={!!config}
            value={config?.gridCount ?? gridCount}
            onChange={(e) => setGridCount(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <div className="mb-1">Invest</div>
          <Input
            className=""
            suffix="USDT"
            disabled={!!config}
            value={config ? formatAmount(config.orderSize * config.orderSize, 0, 2) : totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full mt-4">
        {selectedAccount ? (
          <Button className="w-full" onClick={onSubmit}>
            {isRunning ? 'Stop Bot' : 'Start Bot'}
          </Button>
        ) : (
          <Button className="w-full" onClick={() => navigate('/connect-wallet')}>
            {wallet ? 'Select Account' : 'Connect Wallet'}
          </Button>
        )}
      </div>
    </div>
  )
}
