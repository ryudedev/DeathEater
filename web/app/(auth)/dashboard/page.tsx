'use client'
import { CapsuleStorage } from '@/components/capsuleStorage'
import Header from '@/components/header'
import Logs from '@/components/logs'
import TimeLimit from '@/components/timelimit'
import { useDashboardStore } from '@/store'
import { useEffect } from 'react'

export default function Dashboard() {
  const { setInit, error, loading, capsules, user } = useDashboardStore()

  // 初期化処理を1回だけ実行
  useEffect(() => {
    setInit()
  }, [setInit])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <Header title="ホーム" />
      {/* 最新のカプセルの開封日を表示 */}
      <div className="p-4 flex flex-col gap-6 justify-center">
        {capsules?.length && (
          <>
            <TimeLimit
              initialTime={new Date(
                capsules[capsules.length - 1].upload_deadline!,
              ).getTime()} // アップロード終了時刻
              openTime={new Date(
                capsules[capsules.length - 1].release_date!,
              ).getTime()} // 開封時刻
            />
            <CapsuleStorage capsules={capsules} type="transition" />
            <Logs
              capsule_id={capsules[capsules.length - 1].id!}
              filterUserId={user?.id}
            />
          </>
        )}
      </div>
    </>
  )
}
