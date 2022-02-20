import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export default function Button({ className, ...props }: Props) {
  return (
    <button
      className={`input w-full bg-3 hover:bg-4 rounded px-2 py-2 ${className}`}
      {...props}
    />
  )
}
