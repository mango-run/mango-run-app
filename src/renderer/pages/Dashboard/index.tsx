import { useState } from 'react'
import { DashboardContextProvider } from './context'
import ActionPanel from './panels/ActionPanel'
import HistoryPanel from './panels/HistoryPanel'
import PositionsPanel from './panels/PositionsPanel'

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
    <DashboardContextProvider>
      <div className="flex flex-row items-stretch justify-center mx-auto max-w-6xl px-8 mt-8">
        <div className="bg-bg2 w-96 px-8 pb-8">
          <ActionPanel />
        </div>
        <div className="flex-1 bg-bg2 ml-8">
          <div className="flex items-center">
            <TabItem title="Positions" isActive={activeTab === 0} onClick={() => setActiveTab(0)} />
            <TabItem title="History" isActive={activeTab === 1} onClick={() => setActiveTab(1)} />
          </div>
          <div>
            {activeTab === 0 && <PositionsPanel />}
            {activeTab === 1 && <HistoryPanel />}
          </div>
        </div>
      </div>
    </DashboardContextProvider>
  )
}
