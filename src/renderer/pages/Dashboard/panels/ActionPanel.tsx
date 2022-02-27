import { Button, Input } from "antd"

export default function ActionPanel() {
  return (
    <div>
      <div className="mt-8">Edit Grid Trading Bot</div>
      <div>
        <div className="px-8 mt-6">
          <div className="flex flex-row">
            <div className="flex-1 mr-8">
              <div>Lower Price</div>
              <Input className="" />
            </div>
            <div className="flex-1">
              <div>Upper Price</div>
              <Input className="" />
            </div>
          </div>
          <div className="mt-6">
            <div>Grids (2-50)</div>
            <Input className="" />
          </div>
          <div className="mt-6">
            <div>Invest</div>
            <Input className="" suffix="USDT" />
            <div className="text-right">Balance: 100 USDT</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="primary">Submit</Button>
        </div>
      </div>
    </div>
  )
}
