import { IPC_SOLANA_ON_WALLET_CHANGE, IPC_SOLANA_SET_WALLET } from 'ipc/channels'
import { useCallback, useEffect, useState } from 'react'

export default function useSolana() {
  const { ipc } = window.electron
  const [wallet, setWallet] = useState<string | undefined>()

  const connectWallet = useCallback((privateKey: string) => {
    try {
      ipc.set(IPC_SOLANA_SET_WALLET, { privateKey })
    } catch (error) {
      console.error(error)
    }
  }, [ipc])

  useEffect(() => {
    ipc.on(IPC_SOLANA_ON_WALLET_CHANGE, (wallet: string) => {
      console.log(wallet)
      setWallet(wallet)
    })
  }, [])

  return {
    connectWallet,
    wallet,
  }
}
