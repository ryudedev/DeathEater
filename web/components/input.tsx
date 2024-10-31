// Input.tsx
import Image from 'next/image'
import { useState } from 'react'

type InputProps<T = string> = {
  type: 'text' | 'number' | 'email' | 'password' | 'file'
  multiple?: boolean
  className?: string
  placeholder?: string
  value?: T
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
  isError: boolean | null // エラーかどうかの状態
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
>

export default function Input<T = string>({
  type,
  multiple,
  className = '',
  placeholder,
  value,
  onChange,
  id,
  isError,
  ...rest
}: InputProps<T>) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="relative">
      <input
        id={id}
        type={showPassword && type === 'password' ? 'text' : type}
        multiple={multiple}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none
          focus-visible:ring-2 ${isError === false ? 'focus-visible:ring-[#F95A5A]' : 'focus-visible:ring-ring'}
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        placeholder={placeholder}
        value={value as string}
        onChange={onChange}
        {...rest}
      />
      {type === 'password' && (
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          <Image
            src={showPassword ? '/eye-off.svg' : '/eye.svg'}
            alt={showPassword ? 'Hide password' : 'Show password'}
            width={20}
            height={20}
          />
        </div>
      )}
    </div>
  )
}
