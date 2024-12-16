'use client'
import { dateToYYYYMMDD } from '@/lib/date'
import { GET_HISTORY } from '@/lib/queries/histories'
import { User } from '@/type'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Card from './card'

type Logs = {
  id?: string
  capsule_id?: string
  history_id?: string
  event?: string
  user_id?: string
  created_at?: Date
  updated_at?: Date
  user?: User
}

type LogsProps = {
  // ログのリスト
  capsule_id: string
  // フィルタリングするユーザーID
  filterUserId?: string | null
}

export default function Logs({ capsule_id, filterUserId = null }: LogsProps) {
  const [logs, setLogs] = useState<Logs[]>([])

  const { loading, error, data } = useQuery(GET_HISTORY, {
    variables: { capsule_id },
    skip: !capsule_id,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data) {
      setLogs(data.findByCapsuleId)
    }
  }, [data])

  // 追加：履歴のuser_idを取得するヘルパー関数
  const getUserIdFromHistoryId = (history_id: string) => {
    // history_idに該当する履歴を取得
    const history = logs.find((log) => log.id === history_id)
    return history ? history.user_id : null
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  return (
    <Card flexDir="column" gap={2.5} className="p-6 overflow-scroll">
      {logs
        .filter(
          (log) =>
            filterUserId === null ||
            log.user_id === filterUserId ||
            (log.user?.role === 'ADMIN' &&
              getUserIdFromHistoryId(log.history_id!) === filterUserId),
        )
        .map((log) => (
          <div key={log.id}>
            <div className="flex flex-col gap-2">
              <span className="text-description text-sm">
                {dateToYYYYMMDD(new Date(log.created_at!))}
              </span>
              <p className="">{log.event}</p>
            </div>
            <hr className="bg-border" />
          </div>
        ))}
    </Card>
  )
}
