'use client'
import Header from '@/components/header'
import MemberList from '@/components/memberlist'
import { GET_MEMBER } from '@/lib/queries/histories'
import { useDashboardStore } from '@/store'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

export default function Members() {
  const { userClasses } = useDashboardStore()
  const [class_id, setClassId] = useState<string>()
  const [members, setMembers] = useState([])
  const { loading, error, data } = useQuery(GET_MEMBER, {
    variables: { class_id },
    skip: !class_id, // emailがまだ取得されていない場合クエリをスキップ
    fetchPolicy: 'network-only', // サーバーから常に最新データを取得
    onError: (error) => {
      console.error('Detailed GraphQL Error in GET_HISTORY:', error)
      console.error('Error Details:', JSON.stringify(error, null, 2))
      console.error('Variables used:', { class_id })
    },
  })
  useEffect(() => {
    if (userClasses?.length) {
      const classId = userClasses[userClasses.length - 1].class_id
      setClassId(classId)
    }
  }, [userClasses])

  useEffect(() => {
    if (data) {
      console.log(data.getMemberList)
      setMembers(data.getMemberList)
    }
  }, [data])

  if (loading) return <div>loading...</div>
  if (error) return <div>{error.message}</div>
  return (
    <div className="w-screen h-screen flex flex-col gap-2">
      <Header showBackButton title="メンバー" />
      <div className="p-4 flex flex-col gap-6 justify-center">
        {members.length ? (
          <MemberList members={members} />
        ) : (
          <div>loading...</div>
        )}
      </div>
    </div>
  )
}
