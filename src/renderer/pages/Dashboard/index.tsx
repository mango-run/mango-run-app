import { useState } from 'react'
import ActionPanel from './panels/ActionPanel'
import HistoryPanel from './panels/HistoryPanel'
import PositionsPanel from './panels/PositionsPanel'
import OrdersPanel from './panels/OrdersPanel'

function TabItem({ title, isActive, onClick }: { title: string; isActive: boolean; onClick: any }) {
  const className = isActive ? 'border-primary text-primary' : ''
  return (
    <div className={`flex-1 text-center py-4 cursor-pointer border-b-2 ${className}`} onClick={onClick}>
      {title}
    </div>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="flex flex-row items-stretch justify-center mx-auto max-w-6xl px-8 mt-8">
      <div className="bg-bg2 w-96 px-8 pb-8">
        <ActionPanel />
      </div>
      <div className="flex-1 bg-bg2 ml-8">
        <div className="flex items-center">
          <TabItem title="Orders" isActive={activeTab === 0} onClick={() => setActiveTab(0)} />
          <TabItem title="Positions" isActive={activeTab === 1} onClick={() => setActiveTab(1)} />
          <TabItem title="History" isActive={activeTab === 2} onClick={() => setActiveTab(2)} />
        </div>
        <div>
          {activeTab === 0 && <OrdersPanel />}
          {activeTab === 1 && <PositionsPanel />}
          {activeTab === 2 && <HistoryPanel />}
        </div>
      </div>
    </div>
  )
}
