// src/app/api/live/create.ts
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid' // ランダムIDを生成

// 仮のデータベース代わりの保存（本番環境ではデータベースに保存する）
const liveRooms: { [key: string]: { date: string; isStarted: boolean } } = {}

export async function GET() {
  const roomId = uuidv4() // ランダムなIDを生成
  const startDate = new Date().toISOString() // ライブの開始日時を生成（適宜変更）

  // ライブルーム情報を仮保存
  liveRooms[roomId] = { date: startDate, isStarted: false }

  const liveUrl = `${process.env.BASE_URL}/live/${roomId}`

  return NextResponse.json({ roomId, liveUrl })
}
