import { useState } from "react"
import ActionPanel from "./panels/ActionPanel"
import HistoryPanel from "./panels/HistoryPanel"
import PositionsPanel from "./panels/PositionsPanel"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="flex flex-row items-stretch justify-center w-full px-8 mt-8">
      <div className="bg-bg2 w-3/5 px-8 pb-8">
        <ActionPanel />
      </div>
      <div className="flex-1 bg-bg2 ml-8">
        <div className="flex items-center border-b">
          <TabItem title="Positions" isActive={activeTab === 0} onClick={() => setActiveTab(0)} />
          <TabItem title="History" isActive={activeTab === 1} onClick={() => setActiveTab(1)} />
        </div>
        <div className="px-2">
          {activeTab === 0 && <PositionsPanel />}
          {activeTab === 1 && <HistoryPanel />}
        </div>
      </div>
    </div>
  )
}

function TabItem({ title, isActive, onClick }: { title: string, isActive: boolean, onClick: any }) {
  return (
    <div
      className={`flex-1 text-center py-2 cursor-pointer hover:text-primary ${isActive ? '' : ''}`}
      onClick={onClick}>
      {title}
    </div>
  )
}
