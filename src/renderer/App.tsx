import { MemoryRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import ConnectWallet from './pages/ConnectWallet'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect-wallet" element={<ConnectWallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>

  )
}

declare global {
  interface Window {
    electron: {
      ipc: {
        get: (channel: string, payload: any) => any,
        set: (channel: string, payload: any) => void,
        on: (channel: string, callback: (...params: any) => void) => void,
        once: (channel: string, callback: (...params: any) => void) => void,
      }
    }
  }
}
