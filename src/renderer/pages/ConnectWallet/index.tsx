import { useCallback, useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import useStore from '../../hooks/useStore'

// TODO: migration for storage
export default function ConnectWallet() {
  const [pkey, setPkey] = useStore('private_key')
  const [input, setInput] = useState('')

  const onSubmit = useCallback(() => {
    setPkey(input)
  }, [setPkey, input])

  return (
    <div className="flex flex-row items-center justify-center w-full">
      <div className="w-80 mt-20 bg-2 rounded px-4 py-4 text-sm">
        <Input
          className="mb-4"
          value={input}
          onInputText={(text) => setInput(text)}
        />
        <Button className="mb-4" onClick={onSubmit}>
          Import Private Key
        </Button>
        <div>Stored Private Key: {pkey}</div>
      </div>
    </div>
  )
}
