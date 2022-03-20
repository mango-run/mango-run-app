import { DetailedHTMLProps, InputHTMLAttributes } from 'react'

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  onInputText: (text: string) => void
}

export default function Input({ className, onInputText, ...props }: Props) {
  return (
    <input
      className={`w-full bg-bg1 rounded px-2 py-2 ${className}`}
      type="text"
      onChange={(e) => onInputText(e.target.value)}
      {...props}
    />
  )
}
