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

  useEffect(() => {
    if (!capsules) return
    const new_capsule = capsules[capsules.length - 1]
    if (roomId !== new_capsule.url) {
      router.push('/dashboard')
    }
    const release_date = new Date(new_capsule.release_date!)
    if (release_date.getTime() < new Date().getTime()) {
      setIsOpened(true)
    }
  }, [capsules])

  if (!isOpened) {
    return <p>まだ開封日ではありません。</p>
  }

  return (
    <div>
      <CapsuleOpen isTransition seconds={2000} roomId={roomId} />
    </div>
  )
}
