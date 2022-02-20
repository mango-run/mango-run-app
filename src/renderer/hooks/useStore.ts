import { useState } from 'react'

export default function useStore(
  key: string,
  initialValue?: string
): [string, (value: string) => void] {
  const { store } = window.electron
  const defaultValue: string = store.get(key) ?? initialValue
  const [storedValue, setStoredValue] = useState(defaultValue)

  const setValue = (value: string) => {
    try {
      setStoredValue(value)
      store.set(key, value)
    } catch (error) {
      console.error(error)
    }
  }
  return [storedValue, setValue]
}
