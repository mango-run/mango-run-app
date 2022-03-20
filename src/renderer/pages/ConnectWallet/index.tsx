import { useCallback, useState } from 'react'
import { useSolanaContext } from 'renderer/contexts/solana'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Accounts from './Accounts'

// TODO: migration for storage
export default function ConnectWallet() {
  const { wallet, connectWallet } = useSolanaContext()
  const [input, setInput] = useState('')

  const onSubmit = useCallback(() => {
    connectWallet(input)
  }, [connectWallet, input])

  return (
    <div className="flex flex-col items-center justify-center w-full mt-16">
      <div className="w-96 bg-bg2 rounded px-4 py-4 text-sm">
        <Input className="mb-4" value={input} onInputText={(text) => setInput(text)} />
        <Button className="mb-4" onClick={onSubmit}>
          Import Private Key
        </Button>
        <div>
          <div className="mb-1 opacity-60">Current wallet:</div>
          <div className="text-xs">{wallet}</div>
        </div>
      </div>

      {wallet && <Accounts />}
    </div>
  )
}
