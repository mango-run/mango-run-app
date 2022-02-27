import { IPC_SOLANA_GET_WALLET, IPC_SOLANA_ON_WALLET_CHANGE, IPC_SOLANA_SET_WALLET } from 'ipc/channels'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface ISolanaContext {
  wallet?: string
  connectWallet: (privateKey: string) => void
}

const SolanaContext = createContext<ISolanaContext>({
  connectWallet: () => { },
})

export function SolanaContextProvider({ children }: { children: any }) {
  const { ipc } = window.electron
  const defaultWallet = ipc.get(IPC_SOLANA_GET_WALLET)
  const [wallet, setWallet] = useState<string | undefined>(defaultWallet)

  const connectWallet = useCallback((privateKey: string) => {
    try {
      ipc.set(IPC_SOLANA_SET_WALLET, { privateKey })
    } catch (error) {
      console.error(error)
    }
  }, [ipc])

  useEffect(() => {
    ipc.on(IPC_SOLANA_ON_WALLET_CHANGE, (wallet: string) => {
      setWallet(wallet)
    })
  }, [])

  return <SolanaContext.Provider value={{
    connectWallet,
    wallet,
  }}>
    {children}
  </SolanaContext.Provider>
}

export function useSolanaContext() {
  return useContext(SolanaContext)
}
