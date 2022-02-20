import { MemoryRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any
        set: (key: string, val: any) => void
      }
    }
  }
}
