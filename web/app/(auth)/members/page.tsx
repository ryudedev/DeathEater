'use client'
import Header from '@/components/header'
import MemberList from '@/components/memberlist'
import { useDashboardStore } from '@/store'
import { useEffect } from 'react'

export default function Members() {
  const { userClasses, members, loading, error, setClassMembers } =
    useDashboardStore()

  useEffect(() => {
    if (userClasses?.length) {
      const classId = userClasses[userClasses.length - 1].class_id
      if (classId) {
        setClassMembers(classId) // クラスIDに基づいてメンバー情報を取得
      }
    }
  }, [userClasses, setClassMembers])

  if (loading) return <div>loading...</div>
  if (error) return <div>{error.message}</div>
  return (
    <>
      <Header showBackButton title="メンバー" />
      <div className="p-4 flex flex-col gap-6 justify-center">
        {members?.length ? (
          <MemberList members={members} />
        ) : (
          <div>loading...</div>
        )}
      </div>
    </>
  )
}
