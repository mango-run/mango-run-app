import { MemoryRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import ConnectWallet from './pages/ConnectWallet'
import Dashboard from './pages/Dashboard'
import { SolanaContextProvider } from './contexts/solana'
import { MangoContextProvider } from './contexts/mango'

export default function App() {
  return (
    <SolanaContextProvider>
      <MangoContextProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/connect-wallet" element={<ConnectWallet />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </MangoContextProvider>
    </SolanaContextProvider>
  )
}

declare global {
  interface Window {
    electron: {
      ipc: {
        get: (channel: string, payload?: any) => any
        send: (channel: string, payload: any) => void
        on: (channel: string, callback: (...params: any) => void) => void
        once: (channel: string, callback: (...params: any) => void) => void
        off: (channel: string, callback: (...params: any) => void) => void
      }
    }
  }
}
