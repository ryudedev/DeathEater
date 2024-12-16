import React, { useEffect, useState } from 'react'
import Card from './card'

interface TimeLimitProps {
  initialTime: number // アップロード終了時刻（getTime()の値）
  openTime: number // 開封時刻（getTime()の値）
}

interface TimeUnits {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const TimeLimit: React.FC<TimeLimitProps> = ({ initialTime, openTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime - Date.now()) // 残り時間（ミリ秒）
  const [isUploadPhase, setIsUploadPhase] = useState<boolean>(true) // アップロード中かどうか

  useEffect(() => {
    const timer: NodeJS.Timeout = setInterval(() => {
      const now = Date.now()
      const remainingTime = isUploadPhase ? initialTime - now : openTime - now

      if (remainingTime <= 0) {
        if (isUploadPhase) {
          setIsUploadPhase(false)
          setTimeLeft(openTime - now)
        } else {
          clearInterval(timer)
          setTimeLeft(0)
        }
      } else {
        setTimeLeft(remainingTime)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isUploadPhase, initialTime, openTime])

  const calculateTimeUnits = (milliseconds: number): TimeUnits => {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000))
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const remainingSeconds = seconds % 60
    return { days, hours, minutes, seconds: remainingSeconds }
  }

  const { days, hours, minutes, seconds } = calculateTimeUnits(timeLeft)

  return (
    <Card bgColor="blue" className="pt-8 pb-5 pl-1 pr-1">
      <div className="absolute -top-1 -left-1.5 flex items-center justify-center px-4 py-2 rounded-br-2xl font-bold bg-white">
        <div className="text-xs text-[#441AFF]">
          {isUploadPhase ? 'アップロード終了まで' : '開封まで'}
        </div>
      </div>
      <div className="flex items-center justify-center tracking-widest text-white text-4xl font-black">
        {days > 0 ? (
          <>
            {days}
            <div className="text-sm pt-2.5">日　　</div> {hours}：{minutes}
          </>
        ) : (
          <>
            {String(hours).padStart(2, '0')}：{String(minutes).padStart(2, '0')}
            ：{String(seconds).padStart(2, '0')}
          </>
        )}
      </div>
    </Card>
  )
}

export default TimeLimit
