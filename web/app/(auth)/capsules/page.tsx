'use client'
import { CapsuleStorage } from '@/components/capsuleStorage'
import Header from '@/components/header'
import Menu from '@/components/menu'
import { useDashboardStore } from '@/store'

export default function Capsules() {
  const { capsules } = useDashboardStore()
  return (
    <>
      <Header showBackButton title="カプセル詳細" />
      <div className="p-4 flex flex-col gap-6 justify-center">
        {capsules?.length ? (
          <CapsuleStorage capsules={capsules} type="add" />
        ) : (
          <div>loading...</div>
        )}
        <div>
          <Menu />
        </div>
      </div>
    </>
  )
}
