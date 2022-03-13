import { Input } from 'antd'
import { useCallback } from 'react'
import { useSolanaContext } from 'renderer/contexts/solana'
import Button from '../../../components/Button'
import { useDashboardContext } from '../context'

export default function ActionPanel() {
  const { startBot } = useDashboardContext()
  const { wallet } = useSolanaContext()

  const onSubmit = useCallback(async () => {
    if (!wallet) {
      return
    }
    const args = {
      publicKey: wallet,
      baseSymbol: 'SOL',
      marketKind: 'perp',
      priceUpperCap: 90,
      priceLowerCap: 80,
      gridCount: 5,
      orderSize: 0.01,
    } as any
    await startBot(args)
  }, [startBot, wallet])

  return (
    <div>
      <div className="my-4 font-bold text-lg text-center">
        Edit Grid Trading Bot
      </div>
      <div>
        <div className="flex flex-row">
          <div className="flex-1 mr-4">
            <div className="mb-1">Lower Price</div>
            <Input className="" />
          </div>
          <div className="flex-1 ml-4">
            <div className="mb-1">Upper Price</div>
            <Input className="" />
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-1">Grids (2-50)</div>
          <Input className="" />
        </div>
        <div className="mt-6">
          <div className="mb-1">Invest</div>
          <Input className="" suffix="USDT" />
          <div className="text-right mt-2">Balance: 100 USDT</div>
        </div>
      </div>
      <div className="w-full mt-4">
        <Button className="w-full" onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}
