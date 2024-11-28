'use client'
import Card from '@/components/card'
import Header from '@/components/header'
import MediaBar from '@/components/mediaBar'
import { MediaItem, mediaType } from '@/components/mediaItem'
import TimeLimit from '@/components/timelimit'
import { get_cookie } from '@/lib/cookie'
import { calculateDateDifference } from '@/lib/date'
import { GET_USER } from '@/lib/queries/users'
import {
  Capsule,
  User,
  UserClassesWithClass,
  UserClassesWithoutCapsules,
} from '@/type'
import { useQuery } from '@apollo/client'
import Image from 'next/image'
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
  const [capsules, setCapsules] = useState<Capsule[] | null | undefined>(null)

  const mediaArray = [
    mediaType.image,
    mediaType.video,
    mediaType.audio,
    mediaType.text,
    mediaType.free,
  ]

  useEffect(() => {
    console.log(user)
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

      console.log(data.findUserByEmail)
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
            <Card flexDir="row" gap={2.5} className="p-6 items-center">
              <div className="flex-1 flex px-2.5 py-2.5 justify-center">
                <Image
                  src="/Capsule.svg"
                  alt="Capsule"
                  width={148}
                  height={61}
                  className="w-full h-full max-h-[148px]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2.5">
                <h3 className="text-xl font-bold">
                  {capsules[capsules.length - 1].name}
                </h3>
                <div className="flex flex-col gap-1 justify-end">
                  <MediaBar
                    image={24}
                    audio={8}
                    video={18}
                    text={13}
                    free={37}
                  />
                  <span className="text-description">
                    {calculateDateDifference(
                      new Date(capsules[capsules.length - 1].release_date!),
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-[18px]">
                  {mediaArray.map((type) => (
                    <MediaItem type={type} key={type} />
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
