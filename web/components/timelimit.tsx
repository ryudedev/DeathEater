// components/timelimit.tsx
import React, { useEffect, useState } from 'react'
import Card from './card'

// <TimeLimit initialTime={10} openTime={10000000} />

interface TimeLimitProps {
  initialTime: number
  openTime: number
}

const TimeLimit: React.FC<TimeLimitProps> = ({ initialTime, openTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isClient, setIsClient] = useState(false)
  const [displayText, setDisplayText] = useState('アップロード終了まで')

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    if (timeLeft <= 0) {
      if (displayText === 'アップロード終了まで') {
        setDisplayText('開封まで')
        setTimeLeft(openTime)
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isClient, displayText, openTime])

  if (!isClient) return null

  const calculateTimeUnits = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    return { days, hours, minutes }
  }

  const { days, hours, minutes } = calculateTimeUnits(timeLeft)

  return (
    <div className="p-4 flex items-center justify-center">
      <Card
        bgColor={'blue'}
        padding={{
          top: 10,
          bottom: 10,
          left: 4,
          right: 4,
        }}
      >
        <div className="absolute w-[140px] h-[40px] bg-white -top-1 -left-1.5 flex items-center justify-center rounded-br-2xl font-bold">
          <div className="text-xs text-[#441AFF]">{displayText}</div>
        </div>
        <div className="flex items-center justify-center tracking-widest text-white text-4xl font-black">
          {days}
          <div className="text-sm pt-2.5">日　　</div> {hours}：{minutes}
        </div>
      </Card>
    </div>
  )
}

export default TimeLimit
