'use client'
import Header from '@/components/header'
import Logs from '@/components/logs'
import { useCapsules } from '@/store/capsules'

export default function Log() {
  const { capsules } = useCapsules()
  return (
    <div className="w-screen h-screen flex flex-col gap-2">
      <Header showBackButton title="ログ" />
      <div className="h-full p-4 flex flex-col gap-6 justify-start overflow-scroll">
        {capsules?.length ? (
          <Logs capsule_id={capsules[capsules.length - 1].id!} />
        ) : (
          <div>loading...</div>
        )}
      </div>
    </div>
  )
}
