'use client'
import { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

interface UserJoinedData {
  userId: string
  userCount: number
}

interface SignalData {
  type?: 'offer' | 'answer'
  candidate?: RTCIceCandidate
}

interface SignalMessage {
  signal: SignalData
  roomId: string
}

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const localAudioRef = useRef<HTMLAudioElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (info: string): void => {
    setDebugInfo((prev) => [...prev, `${new Date().toISOString()} - ${info}`])
    console.log(debugInfo)
  }

  const createPeerConnection = (): RTCPeerConnection => {
    addDebugInfo('Creating new peer connection')
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    })

    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        addDebugInfo('Sending ICE candidate')
        socketRef.current?.emit('signal', {
          signal: { candidate: event.candidate },
          roomId: 'room1',
        } as SignalMessage)
      }
    }

    pc.ontrack = (event: RTCTrackEvent) => {
      addDebugInfo(`Remote track received: ${event.streams[0]?.id}`)
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0]
        addDebugInfo('Set remote audio stream')
      }
    }

    pc.onconnectionstatechange = () => {
      addDebugInfo(`Connection state changed to: ${pc.connectionState}`)
    }

    pc.oniceconnectionstatechange = () => {
      addDebugInfo(`ICE connection state changed to: ${pc.iceConnectionState}`)
    }

    return pc
  }

  const startCall = async (isCaller: boolean): Promise<void> => {
    try {
      addDebugInfo('Starting call as ' + (isCaller ? 'caller' : 'receiver'))
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      addDebugInfo(`Got local stream with ${stream.getTracks().length} tracks`)
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream
      }

      const pc = createPeerConnection()
      peerConnectionRef.current = pc

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream)
        addDebugInfo(`Added track: ${track.kind}`)
      })

      if (isCaller) {
        addDebugInfo('Creating offer as caller')
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socketRef.current?.emit('signal', {
          signal: offer,
          roomId: 'room1',
        } as SignalMessage)
      }
    } catch (error) {
      addDebugInfo(
        `Error in startCall: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket'],
    })

    socketRef.current.on('connect', () => {
      addDebugInfo(`Socket connected: ${socketRef.current?.id}`)
      socketRef.current?.emit('joinRoom', { roomId: 'room1' })
    })

    socketRef.current.on('userJoined', async (data: UserJoinedData) => {
      addDebugInfo(`User joined room: ${data.userId}`)
      const isFirstUser = data.userId === socketRef.current?.id
      await startCall(!isFirstUser)
    })

    socketRef.current.on(
      'signal',
      async ({ signal }: { signal: SignalData }) => {
        try {
          const pc = peerConnectionRef.current
          if (!pc) return

          if (signal.type === 'offer') {
            addDebugInfo('Received offer')
            await pc.setRemoteDescription(
              new RTCSessionDescription(signal as RTCSessionDescriptionInit),
            )
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            socketRef.current?.emit('signal', {
              signal: answer,
              roomId: 'room1',
            } as SignalMessage)
            addDebugInfo('Sent answer')
          } else if (signal.type === 'answer') {
            addDebugInfo('Received answer')
            await pc.setRemoteDescription(
              new RTCSessionDescription(signal as RTCSessionDescriptionInit),
            )
          } else if (signal.candidate) {
            addDebugInfo('Received ICE candidate')
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate))
          }
        } catch (error) {
          addDebugInfo(
            `Error handling signal: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      },
    )

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return (
    <div className="w-full h-full">
      {children}
      <audio ref={localAudioRef} autoPlay playsInline />
      <audio ref={remoteAudioRef} autoPlay playsInline />
      <button
        onClick={() => {
          if (localAudioRef.current) {
            localAudioRef.current.muted = !localAudioRef.current.muted
          }
        }}
        className="fixed bottom-4 right-4 p-2 bg-white rounded-full shadow-md"
      >
        {localAudioRef.current?.muted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}
