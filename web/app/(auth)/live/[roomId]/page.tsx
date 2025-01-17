'use client'

import CapsuleOpen from '@/components/capsuelOpen'
import { useDashboardStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type LiveProps = {
  params: {
    roomId: string
  }
}

export default function Live({ params }: LiveProps) {
  const { capsules } = useDashboardStore()
  const router = useRouter()
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const { roomId } = params

  console.log(isOpened)

  useEffect(() => {
    console.log(capsules)
    if (capsules) {
      const currentCapsule = capsules.find((capsule) => capsule.url === roomId)
      console.log(currentCapsule)

      if (!currentCapsule) {
        router.push('/dashboard')
        return
      }

      const release_date = new Date(currentCapsule.release_date!)
      const currentDate = new Date()

      // 開封可能時刻の確認
      if (release_date.getTime() < currentDate.getTime()) {
        setIsOpened(true)
      }

      // ルームが有効かどうかの確認（例：24時間以内）
      const timeLimit = 24 * 60 * 60 * 1000 // 24時間（ミリ秒）
      if (currentDate.getTime() - release_date.getTime() > timeLimit) {
        console.log(currentDate.getTime() - release_date.getTime() > timeLimit)
        router.push('/dashboard')
        return
      }
    }
  }, [capsules, roomId, router])

  // Loading状態の表示
  if (!capsules) {
    return <div>Loading...</div>
  }

  // CapsuleOpenコンポーネントのレンダリング
  return (
    <div className="w-full h-screen">
      <CapsuleOpen isTransition={true} seconds={2000} roomId={roomId} />
    </div>
  )
}
