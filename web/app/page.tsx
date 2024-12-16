'use client'
import Button from '@/components/button'
import Card from '@/components/card'
import Input from '@/components/input'
import Label from '@/components/label'
import MediaAdd from '@/components/mediaAdd'
import Message from '@/components/message'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation' // 修正: useRouter のインポート
import React, { useState } from 'react'

// 定数
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 10

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null)
  const [password, setPassword] = useState<string>('')
  const [isValidPassword, setIsValidPassword] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  /**
   * メールアドレス変更ハンドラー
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setEmail(value)
    setIsValidEmail(EMAIL_REGEX.test(value))
  }

  /**
   * パスワード変更ハンドラー
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setPassword(value)
    setIsValidPassword(value.length >= MIN_PASSWORD_LENGTH)
  }

  /**
   * ログイン処理
   */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // バリデーションチェック
    if (!isValidEmail || !isValidPassword) {
      setErrorMessage('メールアドレスまたはパスワードが無効です')
      return
    }

    try {
      const res = await axios.post(
        '/api/auth/signin',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await res.data
      if (data.error) {
        setErrorMessage(`${data.error}`)
      }

      router.push('/dashboard')
    } catch (err: unknown) {
      // エラーハンドリング
      if (axios.isAxiosError(err)) {
        // AxiosError の場合
        if (err.response) {
          // サーバーがエラーレスポンスを返した場合
          if (err.response.status === 401) {
            setErrorMessage('メールアドレスまたはパスワードが無効です')
          } else {
            setErrorMessage(
              `エラー: ${err.response.data?.message || '不明なエラーが発生しました'}`,
            )
          }
        } else if (err.request) {
          // リクエストは送信されたがレスポンスが無い場合
          setErrorMessage(
            'サーバーから応答がありません。ネットワーク接続を確認してください。',
          )
        } else {
          // その他のエラー
          setErrorMessage(`リクエストエラー: ${err.message}`)
        }
      } else if (err instanceof Error) {
        // 一般的なエラーオブジェクトの場合
        setErrorMessage(`予期しないエラー: ${err.message}`)
      } else {
        // それ以外の場合
        setErrorMessage('不明なエラーが発生しました。')
      }
    }
  }

  return (
    <div>
      <MediaAdd />
      <div className="h-screen w-screen flex flex-col gap-9 p-4 items-center justify-center bg-white">
        <Image
          src="/reminico.svg"
          alt="Icon"
          width={177}
          height={60}
          className="mb-6"
        />
        <Card gap={7} className="p-1 pb-[22px]">
          <Message text={errorMessage} isError={true} />
          <form onSubmit={handleLogin}>
            <div className="w-full flex flex-col gap-1.5 p-3">
              <Label htmlFor="email">
                メール
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
                  onChange={handlePasswordChange}
                  isError={isValidPassword === false}
                />
              </Label>
              <Message
                text={
                  isValidPassword === null
                    ? 'パスワードを入力してください'
                    : isValidPassword
                      ? ''
                      : `最低${MIN_PASSWORD_LENGTH}文字以上で入力してください`
                }
                isError={isValidPassword === false}
              />
            </div>
            <a href="#" className="text-[#1E9A9A] text-xs px-3 pt-3 pb-14">
              ＞パスワードをお忘れの方はこちら
            </a>
            <Button
              className="absolute px-5 py-2 w-[80px] h-[80px] flex items-start justify-start -right-6 -bottom-[27px] bg-[#441AFF] transition duration-300 font-semibold rounded-full"
              type="submit"
            >
              <Image src="/Login.svg" alt="Icon" width={22} height={20} />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
