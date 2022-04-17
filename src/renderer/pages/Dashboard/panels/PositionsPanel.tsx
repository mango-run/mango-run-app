import { formatAmount } from '@funcblock/dapp-sdk'
import { IPosition, useMangoContext } from '../../../contexts/mango'

function Row({ data, isHeader = false }: { data: IPosition; isHeader?: boolean }) {
  // const sideTextColor = data.side === 'Long' ? 'text-green' : 'text-red'
  return (
    <div
      className={`flex flex-row items-center justify-center px-6 py-2 ${isHeader ? 'text-sm opacity-60' : 'text-base'}`}
    >
      <div className="w-40">{data.market}</div>
      <div className="flex-1 text-right">{isHeader ? data.amount : formatAmount(data.amount, 9)}</div>
    </div>
  )
}

export default function PositionsPanel() {
  const { positions } = useMangoContext()
  return (
    <div className="text-white divide-y">
      <Row
        isHeader
        data={{
          market: 'Market',
          side: 'Side' as any,
          amount: 'Amount' as any,
        }}
      />
      {positions?.map((i) => (
        <Row data={i} key={i.market} />
      ))}
    </div>
  )
}
