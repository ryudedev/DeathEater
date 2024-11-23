import { dateToYYYYMMDD } from '@/lib/date'
import Card from './card'

type Logs = {
  id: string
  event: string
  user_id: string
  created_at: Date
}

type LogsProps = {
  // ログのリスト
  logs: Logs[]
  // フィルタリングするユーザーID
  filterUserId?: string | null
}

export default function Logs({ logs, filterUserId = null }: LogsProps) {
  return (
    <Card flexDir="column" gap={2.5} className="p-6">
      {logs
        .filter((log) => filterUserId === null || log.user_id === filterUserId)
        .map((log) => (
          <div key={log.id}>
            <div className="flex flex-col gap-2">
              <span className="text-description text-sm">
                {dateToYYYYMMDD(log.created_at)}
              </span>
              <p className="">{log.event}</p>
            </div>
            <hr className="bg-border" />
          </div>
        ))}
    </Card>
  )
}
