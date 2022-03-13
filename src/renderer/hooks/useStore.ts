import { IPC_STORE_GET, IPC_STORE_SET } from 'ipc/channels'
import { useCallback, useState } from 'react'

export default function useStore(
  key: string,
  initialValue?: string
): [string, (value: string) => void] {
  const { ipc } = window.electron
  const defaultValue: string = ipc.get(IPC_STORE_GET, key) ?? initialValue
  const [storedValue, setStoredValue] = useState(defaultValue)

  const setValue = useCallback(
    (value: string) => {
      try {
        setStoredValue(value)
        ipc.set(IPC_STORE_SET, { key, value })
      } catch (error) {
        console.error(error)
      }
    },
    [setStoredValue, ipc, key]
  )
  return [storedValue, setValue]
}
