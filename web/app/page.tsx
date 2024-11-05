// page.tsx
'use client'
import Header from '@/components/header'
import Input from '@/components/input'
import Label from '@/components/label'
import Message from '@/components/message'
import { User } from '@/type'
import React, { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null)
  const test_user: User = {
    id: 1,
    email: 'remimnico@gmail.com',
    name: 'reminico',
    avatar: 'https://avatars.githubusercontent.com/u/876235',
    role: 'user',
  }

  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(value))
  }

  return (
    <>
      <Header title="トップ" user={test_user} />
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
    </>
  )
}
