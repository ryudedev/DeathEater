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
      console.error('Microphone access error:', error)
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
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map())

  const dotLottieRefCallback = useCallback(
    (ref: DotLottie) => setDotLottie(ref),
    [],
  )

  const createPeerConnection = useCallback(
    async (targetUserId: string) => {
      // Close existing connection if any
      const existingPC = peerConnectionsRef.current.get(targetUserId)
      if (existingPC) {
        existingPC.close()
        peerConnectionsRef.current.delete(targetUserId)
      }

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      })

      peerConnectionsRef.current.set(targetUserId, peerConnection)

      // Add local stream tracks to the peer connection
      if (AudioStateManager.localStream) {
        AudioStateManager.localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, AudioStateManager.localStream!)
        })
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            targetUserId,
            candidate: event.candidate,
            roomId,
          })
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(
          `Connection state for ${targetUserId}:`,
          peerConnection.connectionState,
        )
      }

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind)
        const [remoteStream] = event.streams

        let audioElement = audioElementsRef.current.get(targetUserId)
        if (!audioElement) {
          audioElement = new Audio()
          audioElement.autoplay = true
          audioElement.muted = !speakerEnabled
          audioElementsRef.current.set(targetUserId, audioElement)
        }

        audioElement.srcObject = remoteStream
        audioElement
          .play()
          .catch((error) => console.error('Audio play failed:', error))
      }

      return peerConnection
    },
    [roomId, speakerEnabled],
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

  const handleCall = useCallback(
    async (targetUserId: string) => {
      try {
        console.log('Initiating call to:', targetUserId)
        const pc = await createPeerConnection(targetUserId)

        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        })
        await pc.setLocalDescription(offer)

        socketRef.current?.emit('offer', {
          targetUserId,
          offer,
          roomId,
        })
      } catch (error) {
        console.error('Error creating offer:', error)
      }
    },
    [createPeerConnection, roomId],
  )

  const handleOffer = useCallback(
    async (data: { fromUserId: string; offer: RTCSessionDescriptionInit }) => {
      try {
        console.log('Received offer from:', data.fromUserId)
        const pc = await createPeerConnection(data.fromUserId)

        // Important: First set remote description
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer))

        // Then create and set local description
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        socketRef.current?.emit('answer', {
          targetUserId: data.fromUserId,
          answer,
          roomId,
        })
      } catch (error) {
        console.error('Error handling offer:', error)
      }
    },
    [createPeerConnection, roomId],
  )

  const handleAnswer = useCallback(
    async (data: { fromUserId: string; answer: RTCSessionDescriptionInit }) => {
      try {
        console.log('Received answer from:', data.fromUserId)
        const pc = peerConnectionsRef.current.get(data.fromUserId)
        if (pc && pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
        } else {
          console.log(
            'Peer connection not found or in incorrect state:',
            pc?.signalingState,
          )
        }
      } catch (error) {
        console.error('Error handling answer:', error)
      }
    },
    [],
  )

  const handleIceCandidate = useCallback(
    async (data: { fromUserId: string; candidate: RTCIceCandidateInit }) => {
      try {
        const pc = peerConnectionsRef.current.get(data.fromUserId)
        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        } else {
          console.log('Peer connection not found or remote description not set')
        }
      } catch (error) {
        console.error('Error handling ICE candidate:', error)
      }
    },
    [],
  )

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
    } else {
      try {
        const stream = await AudioStateManager.startAudio()
        if (stream) {
          setMicEnabled(true)
          socketRef.current?.emit('startVoice', { roomId, userId: user.id })

          // Establish connections with existing peers
          capsuleStates.forEach((state) => {
            if (state.userId !== user.id) {
              handleCall(state.userId)
            }
          })
        }
      } catch (error) {
        console.error('Microphone toggle error:', error)
      }
    }
  }

  const toggleSpeaker = () => {
    const newSpeakerState = !speakerEnabled
    setSpeakerEnabled(newSpeakerState)

    // Update all audio elements' muted state
    audioElementsRef.current.forEach((audio) => {
      audio.muted = !newSpeakerState
    })
  }

  useEffect(() => {
    if (!user?.id) return

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      {
        query: { user: user.id, roomId },
      },
    )

    socketRef.current = socket

    socket.on('stateUpdate', setCapsuleStates)
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)
    socket.on('newUserJoined', (userId: string) => {
      if (micEnabled && userId !== user.id) {
        console.log('New user joined, initiating call:', userId)
        handleCall(userId)
      }
    })

    return () => {
      AudioStateManager.stopAudio()
      peerConnectionsRef.current.forEach((pc) => pc.close())
      peerConnectionsRef.current.clear()
      audioElementsRef.current.forEach((audio) => {
        audio.pause()
        audio.srcObject = null
      })
      audioElementsRef.current.clear()
      socket.disconnect()
    }
  }, [
    roomId,
    user?.id,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    handleCall,
    micEnabled,
  ])

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
