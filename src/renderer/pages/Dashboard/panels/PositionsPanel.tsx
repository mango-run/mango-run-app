import { formatAmount } from '@funcblock/dapp-sdk'

function Row({ data, isHeader = false }: { data: any; isHeader?: boolean }) {
  const sideTextColor = data.side === 'Buy' ? 'text-green' : 'text-red'
  return (
    <div
      className={`flex flex-row items-center justify-center px-6 py-2 ${isHeader ? 'text-sm opacity-60' : 'text-base'}`}
    >
      <div className="w-40">{data.market}</div>
      <div className={`w-20 ${!isHeader && sideTextColor}`}>{data.side}</div>
      <div className="flex-1 text-right">
        {!isHeader && '$'}
        {data.price}
      </div>
      <div className="flex-1 text-right">{data.size}</div>
      <div className="flex-1 text-right">
        {!isHeader && '$'}
        {isHeader ? data.value : formatAmount(data.value, 0, 2)}
      </div>
    </div>
  )
}

export default function PositionsPanel() {
  const rows = []
  for (let i = 0; i < 6; i += 1) {
    rows.push({
      market: 'BTC/USD',
      side: i < 3 ? 'Buy' : 'Sell',
      size: 0.1,
      price: 39642.23 + i,
      value: (39642.23 + i) * 0.1,
    })
  }
  return (
    <div className="text-white divide-y">
      <Row
        isHeader
        data={{
          market: 'Market',
          side: 'Side',
          price: 'Price',
          size: 'Size',
          value: 'Value',
        }}
      />
      {rows.map((i) => (
        <Row data={i} />
      ))}
    </div>
  )
}
