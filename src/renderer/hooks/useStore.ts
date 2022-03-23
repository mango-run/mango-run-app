import { IPC_STORE_GET, IPC_STORE_SET } from 'ipc/channels'
import { useCallback, useMemo, useState } from 'react'

export default function useStore(
  key: string,
  initialValue?: string
): [string | undefined, (value: string | undefined) => void] {
  const { ipc } = window.electron
  const defaultValue: string = useMemo(() => ipc.get(IPC_STORE_GET, key) ?? initialValue, [ipc, initialValue, key])
  const [storedValue, setStoredValue] = useState<string | undefined>(defaultValue)

  const setValue = useCallback(
    (value: string | undefined) => {
      try {
        setStoredValue(value)
        ipc.send(IPC_STORE_SET, { key, value })
        console.log('ipc.send(IPC_STORE_SET, { key, value })', { key, value })
      } catch (error) {
        console.error(error)
      }
    },
    [setStoredValue, ipc, key]
  )
  return [storedValue, setValue]
}
