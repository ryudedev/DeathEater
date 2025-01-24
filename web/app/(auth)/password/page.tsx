'use client'
import Header from '@/components/header'
import Input from '@/components/input'
import Label from '@/components/label'
import { useState } from 'react'

export default function Password() {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const [email, setEmail] = useState<string>('')
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setEmail(value)
    setIsValidEmail(EMAIL_REGEX.test(value))
  }
  return (
    <>
      <Header showBackButton title="パスワード変更" />
      <Label htmlFor="email">
        メールアドレス
        <Input
          id="email"
          name="email"
          value={email}
          placeholder="reminico@gmail.com"
          type="email"
          onChange={handleEmailChange}
          isError={isValidEmail === false}
        />
      </Label>
    </>
  )
}
