import { formatAmount } from '@funcblock/dapp-sdk'
import { IOrder, useMangoContext } from '../../../contexts/mango'

function Row({ data, isHeader = false }: { data: IOrder | any; isHeader?: boolean }) {
  const sideTextColor = data.side === 'Buy' ? 'text-green' : 'text-red'
  return (
    <div
      className={`flex flex-row items-center justify-center px-6 py-2 ${isHeader ? 'text-sm opacity-60' : 'text-xs'}`}
    >
      <div className="w-40">{data.market}</div>
      <div className={`w-20 ${!isHeader && sideTextColor}`}>{data.side}</div>
      <div className="flex-1 text-right">
        {!isHeader && '$'}
        {isHeader ? data.price : formatAmount(data.price, 0, 2)}
      </div>
      <div className="flex-1 text-right">{isHeader ? data.size : formatAmount(data.size)}</div>
      <div className="flex-1 text-right">
        {!isHeader && '$'}
        {isHeader ? data.value : formatAmount(data.value, 0, 2)}
      </div>
    </div>
  )
}

export default function OrdersPanel() {
  const { orders } = useMangoContext()

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
      {orders ? orders.map((i) => <Row data={i} />) : <div>No order</div>}
    </div>
  )
}
