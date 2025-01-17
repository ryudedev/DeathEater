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

const AudioStateManager = {
  localStream: null as MediaStream | null,
  peerConnections: new Map<string, RTCPeerConnection>(),

  async startAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.localStream = stream
      return stream
    } catch (error) {
      console.error('マイクアクセスエラー:', error)
      throw error
    }
  },

  stopAudio() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
    this.peerConnections.forEach((pc) => pc.close())
    this.peerConnections.clear()
  },
  debugAudioLevels() {
    if (!this.localStream) {
      console.log('🎤 No local stream available')
      return
    }

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(this.localStream)
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1)

    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 1024

    microphone.connect(analyser)
    analyser.connect(scriptProcessor)
    scriptProcessor.connect(audioContext.destination)

    scriptProcessor.onaudioprocess = function () {
      const array = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(array)
      const arraySum = array.reduce((a, value) => a + value, 0)
      const average = arraySum / array.length
      console.log('🎤 Microphone volume:', Math.round(average))
      // 音量が一定以上なら色を変えて表示
      if (average > 30) {
        console.log('%c🔊 Active Audio!', 'color: #00ff00')
      }
    }

    return () => {
      scriptProcessor.disconnect()
      analyser.disconnect()
      microphone.disconnect()
    }
  },

  // RTCPeerConnection の状態をモニタリング
  monitorPeerConnection(pc: RTCPeerConnection, label: string) {
    pc.oniceconnectionstatechange = () => {
      console.log(`💻 [${label}] ICE State:`, pc.iceConnectionState)
    }

    pc.onconnectionstatechange = () => {
      console.log(`💻 [${label}] Connection State:`, pc.connectionState)
    }

    pc.onicecandidate = (event) => {
      console.log(`💻 [${label}] ICE candidate:`, event.candidate)
    }

    pc.ontrack = (event) => {
      console.log(`💻 [${label}] Track received:`, event.track.kind)

      // 受信した音声トラックのレベルをモニタリング
      if (event.track.kind === 'audio') {
        const audioContext = new AudioContext()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaStreamSource(event.streams[0])
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1)

        analyser.smoothingTimeConstant = 0.8
        analyser.fftSize = 1024

        source.connect(analyser)
        analyser.connect(scriptProcessor)
        scriptProcessor.connect(audioContext.destination)

        scriptProcessor.onaudioprocess = function () {
          const array = new Uint8Array(analyser.frequencyBinCount)
          analyser.getByteFrequencyData(array)
          const arraySum = array.reduce((a, value) => a + value, 0)
          const average = arraySum / array.length
          console.log(
            `🔊 [${label}] Received Audio Level:`,
            Math.round(average),
          )
        }
      }
    }
  },
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
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map())
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  const dotLottieRefCallback = useCallback(
    (ref: DotLottie) => setDotLottie(ref),
    [],
  )

  const setupPeerConnection = useCallback(
    async (targetUserId: string) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      })

      // デバッグモニタリングを追加
      AudioStateManager.monitorPeerConnection(
        peerConnection,
        `Peer-${targetUserId}`,
      )

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            roomId,
            targetUserId,
            candidate: event.candidate,
          })
        }
      }

      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams
        const audio = new Audio()
        audio.srcObject = remoteStream
        audio.play()
        audioRefs.current[targetUserId] = audio
      }

      peerConnectionsRef.current.set(targetUserId, peerConnection)
      return peerConnection
    },
    [roomId],
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
    const userIcon = 'https://via.placeholder.com/50'
    socketRef.current?.emit('openCapsule', {
      userId: user.id,
      userIcon,
      roomId,
    })
  }

  const toggleMicrophone = async () => {
    if (!user?.id) return

    if (micEnabled) {
      AudioStateManager.stopAudio()
      setMicEnabled(false)
      socketRef.current?.emit('stopVoice', { roomId, userId: user.id })
      console.log('🎤 Microphone disabled')
    } else {
      try {
        const stream = await AudioStateManager.startAudio()
        if (stream) {
          // マイクレベルのモニタリングを開始
          const cleanup = AudioStateManager.debugAudioLevels()
          socketRef.current?.emit('startVoice', {
            roomId,
            userId: user.id,
          })
          setMicEnabled(true)
          console.log('🎤 Microphone enabled')

          // コンポーネントのクリーンアップ時に監視を停止
          return () => cleanup?.()
        }
      } catch (error) {
        console.error('🚫 マイク切り替えエラー:', error)
      }
    }
  }

  const toggleSpeaker = () => {
    if (!user?.id) {
      console.warn('Invalid userId for toggleSpeaker')
      return
    }

    const newSpeakerState = !speakerEnabled
    setSpeakerEnabled(newSpeakerState)
    Object.values(audioRefs.current).forEach((audio) => {
      audio.muted = newSpeakerState
    })
  }

  useEffect(() => {
    if (!user?.id) return

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      {
        query: {
          user: user.id,
          roomId,
        },
      },
    )

    socketRef.current = socket

    socket.on('stateUpdate', (state: CapsuleState[]) => {
      console.log('Received state update:', state)
      setCapsuleStates(state)
    })

    socket.on('newUserStream', async ({ userId }) => {
      const pc = await setupPeerConnection(userId)
      if (AudioStateManager.localStream) {
        AudioStateManager.localStream.getTracks().forEach((track) => {
          pc.addTrack(track, AudioStateManager.localStream!)
        })
      }
    })

    socket.on('userStreamStopped', ({ userId }) => {
      peerConnectionsRef.current.get(userId)?.close()
      peerConnectionsRef.current.delete(userId)
      if (audioRefs.current[userId]) {
        audioRefs.current[userId].pause()
        delete audioRefs.current[userId]
      }
    })

    // Save refs for cleanup
    const currentPeerConnections = peerConnectionsRef.current
    const currentAudioRefs = audioRefs.current

    return () => {
      AudioStateManager.stopAudio()
      currentPeerConnections.forEach((pc) => pc.close())
      currentPeerConnections.clear()
      Object.values(currentAudioRefs).forEach((audio) => {
        audio.pause()
        audio.srcObject = null
      })
      socket.disconnect()
    }
  }, [roomId, user?.id, setupPeerConnection])

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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">カプセルを開けた参加者</h1>
      <ul className="space-y-4">
        {capsuleStates.map((state) => (
          <li key={state.userId} className="flex items-center space-x-4">
            <Image
              src={state.userIcon}
              alt="User Icon"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="font-medium">{state.status}</span>
          </li>
        ))}
      </ul>
      <div className="fixed bottom-4 left-4 right-4 flex justify-center space-x-4">
        <Mic isEnabled={micEnabled} onClick={toggleMicrophone} />
        <Volume isEnabled={speakerEnabled} onClick={toggleSpeaker} />
      </div>
    </div>
  )
}
