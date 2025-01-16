'use client'

import { useDashboardStore } from '@/store'
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import Mic from './mic'
import Volume from './volume'

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
  const [micEnabled, setMicEnabled] = useState(false)
  const [speakerEnabled, setSpeakerEnabled] = useState(true)

  const { user } = useDashboardStore()
  const initialTouchY = useRef<number | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})
  const localStream = useRef<MediaStream | null>(null)

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

  const handleTouchStart = (e: React.TouchEvent) => {
    initialTouchY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (initialTouchY.current !== null) {
      const finalTouchY = e.changedTouches[0].clientY
      if (initialTouchY.current > finalTouchY) {
        playAnimation()
        socketRef.current?.emit('capsule_open', { roomId })
        if (isTransition) {
          openCapsule()
          setTimeout(() => setIsOpen(true), seconds)
        }
      }
      initialTouchY.current = null
    }
  }

  const openCapsule = () => {
    if (!user?.id) return
    const userIcon = 'https://via.placeholder.com/50' // 固定値としてデフォルトを設定
    socketRef.current?.emit('openCapsule', { userId: user.id, userIcon })
  }

  const toggleMicrophone = async () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop())
      localStream.current = null
      setMicEnabled(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        localStream.current = stream
        socketRef.current?.emit('startVoice', { roomId, streamId: stream.id })
        setMicEnabled(true)
      } catch (error) {
        console.error('マイクアクセスエラー:', error)
      }
    }
  }

  const toggleSpeaker = () => {
    if (!user?.id) {
      console.warn('Invalid userId for toggleSpeaker')
      return
    }

    const audio = audioRefs.current[user.id]
    if (audio) {
      audio.muted = !audio.muted
      setSpeakerEnabled(!audio.muted)
    } else {
      console.warn(`Audioオブジェクトが見つかりません: userId=${user.id}`)
      console.log('audioRefs:', audioRefs.current)
    }
  }

  useEffect(() => {
    console.log('ユーザーデータ:', user)
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      {
        query: { user: user?.id as string },
      },
    )
    socketRef.current = socket

    socket.on('stateUpdate', (state: CapsuleState[]) => {
      const validatedState = state.map((item) => ({
        ...item,
        userId: item.userId || 'unknownUserId',
        userIcon: item.userIcon || 'https://via.placeholder.com/50',
      }))
      console.log('Validated stateUpdate:', validatedState)
      setCapsuleStates(validatedState)
    })

    socket.on(
      'voiceStream',
      ({ userId, stream }: { userId: string; stream: MediaStream }) => {
        if (!audioRefs.current[userId]) {
          console.log('Creating new Audio object for:', userId)
          const audio = new Audio()
          audio.srcObject = stream
          audio.muted = false
          audio
            .play()
            .catch((error) => console.error('Audio play error:', error))
          audioRefs.current[userId] = audio
        }
      },
    )

    return () => {
      socket.disconnect()
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
        audio.srcObject = null
      })
    }
  }, [user?.id])

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
            <Image
              src={state.userIcon}
              alt="User Icon"
              width={50}
              height={50}
              style={{ width: '50px', borderRadius: '50%' }}
            />
            {state.status}
          </li>
        ))}
      </ul>
      <Mic isEnabled={micEnabled} onClick={toggleMicrophone} />
      <Volume isEnabled={speakerEnabled} onClick={toggleSpeaker} />
    </div>
  )
}
