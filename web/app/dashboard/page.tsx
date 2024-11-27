'use client'
import Header from '@/components/header'
import { get_cookie } from '@/lib/cookie'
import { GET_USER } from '@/lib/queries/users'
import { User } from '@/type'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [email, setEmail] = useState<string | null | undefined>(null)
  const [user, setUser] = useState<User | null | undefined>(null)

  useEffect(() => {
    const fetchData = async () => {
      const email = await get_cookie('email')
      setEmail(email)
    }

    fetchData()
  }, [])

  // emailが取得できてからGraphQLクエリを発動
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { email },
    skip: !email, // emailがまだ取得されていない場合クエリをスキップ
    fetchPolicy: 'network-only', // サーバーから常に最新データを取得
  })

  // クエリ結果を監視
  useEffect(() => {
    if (data) {
      setUser(data.findUserByEmail)
    }
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="w-screen h-screen flex flex-col gap-2">
      <Header title="ホーム" />
      <p>{user?.email}</p>
    </div>
  )
}
