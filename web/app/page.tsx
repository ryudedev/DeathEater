'use client'
import Button from '@/components/button'
import Card from '@/components/card'
import Input from '@/components/input'
import Label from '@/components/label'
import Message from '@/components/message'
import { cognitoUserPool } from '@/utils/cognito'
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // 修正: useRouter のインポート
import React, { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null)
  const [isValidPassword, setIsValidPassword] = useState<boolean | null>(null)
  const [password, setPassword] = useState<string>('')

  const router = useRouter() // 修正: useRouter フックの使用

  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(value))
  }

  const passwordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)

    if (e.target.value.length >= 10) {
      setIsValidPassword(true)
    } else {
      setIsValidPassword(false)
    }
  }

  const handleLogin = () => {
    if (isValidEmail && isValidPassword) {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      })

      const user = new CognitoUser({
        Username: email,
        Pool: cognitoUserPool,
      })

      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken()
          const idToken = result.getIdToken().getJwtToken()
          alert('ログイン成功！')
          console.log('Access Token:', accessToken)
          console.log('ID Token:', idToken)

          router.push('/media') // 修正: 成功時に /media に遷移
        },
        onFailure: (err) => {
          console.error('ログイン失敗:', err)
          alert('ログイン失敗！')
        },
      })
    } else {
      alert('メールアドレスまたはパスワードが無効です')
    }
  }

  return (
    <div>
      <div className="h-screen w-screen flex flex-col gap-9 p-4 items-center justify-center bg-white">
        <Image
          src="/reminico.svg"
          alt="Icon"
          width={177}
          height={60}
          className="mb-6"
        />
        <Card gap={7} className="p-1 pb-[22px]">
          <div className="w-full flex flex-col gap-1.5 p-3">
            <Label htmlFor="email">
              メール
              <Input
                id="email"
                name="email"
                value={email}
                placeholder="reminico@gmail.com"
                type="email"
                onChange={emailChangeHandler}
                isError={isValidEmail === false}
              />
            </Label>

            <Message
              text={
                isValidEmail === null
                  ? 'メールアドレスを入力してください'
                  : isValidEmail
                    ? ''
                    : '形式が間違っています'
              }
              isError={isValidEmail === false}
            />
          </div>

          <div className="w-full flex flex-col gap-1.5 p-3">
            <Label htmlFor="password">
              パスワード
              <Input
                id="password"
                name="password"
                value={password}
                placeholder="パスワードを入力してください"
                type="password"
                onChange={passwordChangeHandler}
                isError={isValidPassword === false}
              />
            </Label>
            <Message
              text={
                isValidPassword === null
                  ? 'パスワードを入力してください'
                  : isValidPassword
                    ? ''
                    : '10文字以上で入力してください'
              }
              isError={isValidPassword === false}
            />
          </div>
          <Link href={'#'} className="text-[#1E9A9A] text-xs px-3 pt-3 pb-14">
            ＞パスワードをお忘れの方はこちら
          </Link>
          <Button
            onClick={handleLogin}
            padding={{ x: 20, y: 8 }}
            className="absolute w-[80px] h-[80px] flex items-start justify-start -right-6 -bottom-[27px] bg-[#441AFF] transition duration-300 font-semibold rounded-full"
            itemsPosition="center"
            justifyPosition="center"
          >
            <Image src="/Login.svg" alt="Icon" width={22} height={20} />
          </Button>
        </Card>
      </div>
    </div>
  )
}
