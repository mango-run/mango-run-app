import { shorten } from '@funcblock/dapp-sdk'
import { NavLink, useLocation } from 'react-router-dom'
import { useSolanaContext } from 'renderer/contexts/solana'
import mangoImg from '../../../../assets/images/mango.svg'

function NavItem({ path, title }: { path: string; title: string }) {
  const currentPath = useLocation().pathname
  const isCurrent = currentPath.startsWith(path)
  return (
    <NavLink
      to={path}
      className={`text-base ml-4 ${isCurrent ? 'text-primary' : 'text-fg-1'}`}
    >
      {title}
    </NavLink>
  )
}

function WalletStatus() {
  const { wallet } = useSolanaContext()

  return (
    <div>
      <NavLink
        className="bg-bg3 hover:bg-bg4 py-2 px-4 rounded text-primary hover:text-primary"
        to="/connect-wallet"
      >
        {wallet ? shorten(wallet) : 'Connect Wallet'}
      </NavLink>
    </div>
  )
}

export default function Header() {
  return (
    <div className="bg-bg2 text-white px-4 py-6 flex items-center justify-between">
      <div className="flex-1 flex items-center">
        <NavLink to="/">
          <img src={mangoImg} className="w-12 h-12" alt="" />
        </NavLink>
        <NavItem path="/dashboard" title="Dashboard" />
        <NavItem path="/mango-run" title="Mango Run" />
      </div>
      <WalletStatus />
    </div>
  )
}
