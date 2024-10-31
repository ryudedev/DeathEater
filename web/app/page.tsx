// page.tsx
'use client'
import Input from '@/components/input'
import Label from '@/components/label'
import Message from '@/components/message'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null)

  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(value))
  }

  return (
    <div className="inline-flex flex-col gap-1.5">
      <Label htmlFor="email">
        Email
        <Input
          id="email"
          name="email"
          value={email}
          placeholder="reminico@gmail.com"
          type="email"
          onChange={emailChangeHandler}
          isError={isValidEmail}
        />
      </Label>
      <Message
        text={
          isValidEmail
            ? 'メールアドレスを入力してください'
            : '形式が間違っています'
        }
        isError={isValidEmail}
      />
    </div>
  )
}
