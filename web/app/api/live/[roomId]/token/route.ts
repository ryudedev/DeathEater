import { isDateReached } from '@/lib/date'
import { generateRandomToken } from '@/lib/generateRandomToken'
import { NextRequest, NextResponse } from 'next/server'

let generatedToken: string | null = null // トークンをキャッシュ

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const targetDate = searchParams.get('date')

  if (!targetDate) {
    return NextResponse.json(
      { error: '日付が指定されていません。' },
      { status: 400 },
    )
  }

  if (!isDateReached(targetDate)) {
    return NextResponse.json(
      { error: '開封可能日時を過ぎていません。' },
      { status: 403 },
    )
  }

  if (!generatedToken) {
    generatedToken = generateRandomToken() // 初回アクセス時にトークンを生成
  }

  return NextResponse.json({ token: generatedToken })
}
