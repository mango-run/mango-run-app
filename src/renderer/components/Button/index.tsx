import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export default function Button({ className, ...props }: Props) {
  return (
    <button
      type="button"
      className={`input w-full bg-bg3 hover:bg-bg4 rounded px-2 py-2 ${className}`}
      {...props}
    />
  )
}
