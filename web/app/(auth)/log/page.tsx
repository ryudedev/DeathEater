'use client'
import Header from '@/components/header'
import Logs from '@/components/logs'
import { useDashboardStore } from '@/store'

export default function Log() {
  const { capsules } = useDashboardStore()
  return (
    <>
      <Header showBackButton title="ログ" />
      <div className="h-full p-4 flex flex-col gap-6 justify-start overflow-scroll">
        {capsules?.length ? (
          <Logs capsule_id={capsules[capsules.length - 1].id!} />
        ) : (
          <div>loading...</div>
        )}
      </div>
    </>
  )
}
