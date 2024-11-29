'use client'
import { CapsuleStorage } from '@/components/capsuleStorage'
import Header from '@/components/header'
import Logs from '@/components/logs'
import TimeLimit from '@/components/timelimit'
import { get_cookie } from '@/lib/cookie'
import { GET_USER } from '@/lib/queries/users'
import { useCapsules } from '@/store/capsules'
import { User, UserClassesWithClass, UserClassesWithoutCapsules } from '@/type'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [email, setEmail] = useState<string | null | undefined>(null)
  // ユーザー情報を保持
  const [user, setUser] = useState<
    Omit<User, 'userClasses'> | null | undefined
  >(null)
  // クラス情報を保持
  const [userClasses, setUserClasses] = useState<
    UserClassesWithoutCapsules[] | null | undefined
  >(null)
  // カプセル情報を保持
  // const [capsules, setCapsules] = useState<Capsule[] | null | undefined>(null)
  const { capsules, setCapsules } = useCapsules()

  useEffect(() => {
    console.log(userClasses)
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
      // UserオブジェクトからuserClassesを除外
      const userData = data.findUserByEmail
      if (userData) {
        // userClassesを除外して新しいオブジェクトを作成(型宣言もしてください)
        const { userClasses, ...userWithoutClasses } = userData // userClassesを除外して新しいオブジェクトを作成
        setUser(userWithoutClasses)

        // UserClasses情報を変換して設定
        const userClassesWithoutCapsules = userClasses?.map(
          (userClass: UserClassesWithClass) => ({
            ...userClass,
            class: {
              ...userClass.class, // classのプロパティを全て展開
              capsules: undefined, // capsulesをundefinedに設定して削除
            },
          }),
        )

        setUserClasses(userClassesWithoutCapsules)

        // capsules情報をuserClassesから抽出して設定
        const allCapsules = userClasses?.flatMap(
          (userClass: UserClassesWithClass) => userClass.class.capsules || [],
        )
        setCapsules(allCapsules)
      }
    }
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="w-screen h-screen flex flex-col gap-2">
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
    </div>
  )
}
