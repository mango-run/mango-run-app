import { Button as AntButton, ButtonProps } from 'antd'

export default function Button({ className, ...props }: ButtonProps) {
  return (
    <AntButton
      className={`input w-full bg-button hover:bg-button-h rounded flex flex-row justify-center items-center text-fg1 hover:text-fg1 hover:border-transparent px-2 py-2 ${className}`}
      {...props}
    />
  )
}
