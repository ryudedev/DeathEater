'use client'

import { useDashboardStore } from '@/store'
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

type CapsuleOpenProps = {
  isTransition: boolean
  seconds: number
  roomId: string
}

interface CapsuleState {
  userId: string
  userIcon: string
  status: 'OK' | '-'
}

export default function CapsuleOpen({
  isTransition,
  seconds,
  roomId,
}: CapsuleOpenProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [capsuleStates, setCapsuleStates] = useState<CapsuleState[]>([])
  const { user } = useDashboardStore()
  const initialTouchY = useRef<number | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // Lottie関連のコールバック
  const dotLottieRefCallback = useCallback(
    (ref: DotLottie) => setDotLottie(ref),
    [],
  )

  const playAnimation = () => {
    if (dotLottie) {
      dotLottie.play()
      dotLottie.unfreeze()
    }
  }

  // タッチイベント: 開始
  const handleTouchStart = (e: React.TouchEvent) => {
    initialTouchY.current = e.touches[0].clientY
  }

  // タッチイベント: 終了
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (initialTouchY.current !== null) {
      const finalTouchY = e.changedTouches[0].clientY

      // 上方向スワイプの検知
      if (initialTouchY.current > finalTouchY) {
        playAnimation()

        if (socketRef.current) {
          socketRef.current.emit('capsule_open', { roomId })
        }

        if (isTransition) {
          openCapsule()
          setTimeout(() => setIsOpen(true), seconds)
        }
      }

      initialTouchY.current = null // タッチ位置リセット
    }
  }

  // カプセルを開けるリクエストを送信
  const openCapsule = () => {
    if (!user?.id) return // ユーザーが未ログインの場合は何もしない

    const userId = user.id
    const userIcon = 'https://via.placeholder.com/50' // ユーザーアイコン（デフォルト）

    socketRef.current?.emit('openCapsule', { userId, userIcon })
  }

  // WebSocketのセットアップ
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      {
        query: {
          user: user?.id as string, // user.id をクエリパラメータとして送る
        },
      },
    )
    socketRef.current = socket

    // WebSocket接続時
    socket.on('connect', () => console.log('Connected to WebSocket server'))

    // 状態更新を受信
    socket.on('stateUpdate', (state: CapsuleState[]) => {
      console.log('State update received from server:', state) // ログを追加
      setCapsuleStates(state)
    })

    // クリーンアップ
    return () => {
      socket.disconnect()
    }
  }, [user])

  return !isOpen ? (
    <div
      className="w-full h-screen touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <DotLottieReact
        src="/lotties/capsule.lottie"
        dotLottieRefCallback={dotLottieRefCallback}
      />
    </div>
  ) : (
    <div>
      <h1>カプセルを開けた参加者</h1>
      <ul>
        {capsuleStates.map((state) => (
          <li key={state.userId}>
            <img
              src={state.userIcon}
              alt="User Icon"
              style={{ width: '50px', borderRadius: '50%' }}
            />
            {state.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
