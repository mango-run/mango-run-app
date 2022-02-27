import { Input } from "antd"
import Button from '../../../components/Button'

export default function ActionPanel() {
  return (
    <div>
      <div className="my-4 font-bold text-lg text-center">Edit Grid Trading Bot</div>
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
        <Button className="w-full">Submit</Button>
      </div>
    </div>
  )
}
