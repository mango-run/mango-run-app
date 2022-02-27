import { useCallback, useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useSolanaContext } from 'renderer/contexts/solana'

// TODO: migration for storage
export default function ConnectWallet() {
  const { wallet, connectWallet } = useSolanaContext()
  const [input, setInput] = useState('')

  const onSubmit = useCallback(() => {
    connectWallet(input)
  }, [connectWallet, input])

  return (
    <div className="flex flex-row items-center justify-center w-full">
      <div className="w-96 mt-20 bg-bg2 rounded px-4 py-4 text-sm">
        <Input
          className="mb-4"
          value={input}
          onInputText={(text) => setInput(text)}
        />
        <Button className="mb-4" onClick={onSubmit}>
          Import Private Key
        </Button>
        <div>
          <div className='mb-1 opacity-75'>Current wallet:</div>
          <div>{wallet}</div>
        </div>
      </div>
    </div>
  )
}
