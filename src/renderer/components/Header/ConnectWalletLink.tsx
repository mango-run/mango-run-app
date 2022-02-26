import { NavLink } from 'react-router-dom'

export default function ConnectWalletLink() {
  return <div>
    <NavLink className="bg-3 hover:bg-4 py-2 px-4" to={"/connect-wallet"}>Connect Wallet</NavLink>
  </div>
}
