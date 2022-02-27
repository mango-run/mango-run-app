import {Input, Button} from "antd"
export default function Dashboard() {
  return (
    <div className="flex flex-row items-stretch justify-center w-full px-8 mt-8">
      <div className="bg-bg2 w-3/5 px-8 pb-8">
        <div className="mt-8">Edit Gri Trading Bot</div>
        <div>
          <div className="px-8 mt-6">
            <div className="flex flex-row">
              <div className="flex-1 mr-8">
                <div>Lower Price</div>
                <Input className=""/>
              </div>
              <div className="flex-1">
                <div>Upper Price</div>
                <Input className=""/>
              </div>
            </div>
            <div className="mt-6">
              <div>Grids (2-50)</div>
              <Input className=""/>
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
      <div className="w-2/5 border bg-bg2 ml-8">
        <div className="flex items-center border-b">
          <div className="flex-1 text-center py-2 border-r cursor-pointer hover:text-primary">Running</div>
          <div className="flex-1 text-center py-2 cursor-pointer hover:text-primary">History</div>
        </div>
        <div className="px-2">
          <div className="mt-4">1000.12 USDT</div>
          <div className="mt-4">1000.12 USDT</div>
          <div className="mt-4">1000.12 USDT</div>
          <div className="mt-4">1000.12 USDT</div>
        </div>
      </div>
    </div>
  )
}
