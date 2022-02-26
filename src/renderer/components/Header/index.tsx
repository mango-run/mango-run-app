import ConnectWalletLink from './ConnectWalletLink'
import { NavLink } from 'react-router-dom'
import icon from '../../../../assets/icons/64x64.png'

export default function Header() {
  return <div className="bg-2 text-white px-4 py-6 flex items-center justify-between">
    <div className="flex-1 flex items-center">
      <NavLink to="/">
        <img src={icon} className="w-12 h-12"/>
      </NavLink>
      <NavLink to={"/dashboard"} className="ml-4">
        Dashboard
      </NavLink>
    </div>
    <ConnectWalletLink />
  </div>
}
