import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export default function Button({ className, ...props }: Props) {
  return (
    <button
      type="button"
      className={`input w-full bg-button hover:bg-button-h rounded px-2 py-2 ${className}`}
      {...props}
    />
  )
}
