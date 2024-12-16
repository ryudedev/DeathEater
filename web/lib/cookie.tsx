'use server'

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
// クッキーの操作ようのライブラリ
import { cookies } from 'next/headers'

const DEFAULT_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24,
}

// クッキーのキー
export const get_cookie = async (key: string) => {
  // クッキーを取得
  const cookieStore = cookies()
  // クッキーの値を取得
  const data = cookieStore.get(key)
  if (!data?.value) {
    return null
  }
  return data.value
}

// クッキーの設定
export const set_cookie = async (
  key: string,
  value: string,
  options?: Partial<ResponseCookie>, // 型を Partial<ResponseCookie> に変更
) => {
  const cookieStore = cookies()
  const option = options || DEFAULT_OPTIONS // デフォルトオプションとマージ
  cookieStore.set(key, value, option)
}
