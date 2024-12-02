'use client'
import client from '@/lib/apolloClient'
import { get_cookie } from '@/lib/cookie'
import { GET_MEMBER } from '@/lib/queries/histories'
import { GET_USER } from '@/lib/queries/users'
import { Capsule, MemberItem, User, UserClassesWithClass } from '@/type'
import { ApolloError } from '@apollo/client'
import { create } from 'zustand'

type DashboardStore = {
  email: string | null
  user: User | null
  userClasses: UserClassesWithClass[] | null
  capsules: Capsule[] | null
  members: MemberItem[]
  loading: boolean
  error: ApolloError | undefined
  setInit: () => Promise<void> // 初期化処理
  setClassMembers: (class_id: string) => Promise<void> // クラスメンバー情報取得
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  email: null,
  user: null,
  userClasses: null,
  capsules: null,
  members: [],
  loading: false,
  error: undefined, // 初期値は undefined

  setInit: async () => {
    set({ loading: true, error: undefined })

    try {
      // Cookieからemailを取得
      const email = await get_cookie('email')
      if (!email) throw new Error('Email not found in cookies.')

      // GraphQLクエリを実行
      const { data } = await client.query({
        query: GET_USER,
        variables: { email },
        fetchPolicy: 'network-only',
      })

      const userData = data.findUserByEmail
      if (userData) {
        const { userClasses, ...userWithoutClasses } = userData

        // クラス情報からcapsulesを抽出
        const userClassesWithoutCapsules = userClasses?.map(
          (userClass: UserClassesWithClass) => ({
            ...userClass,
            class: {
              ...userClass.class,
              capsules: undefined,
            },
          }),
        )

        const allCapsules = userClasses?.flatMap(
          (userClass: UserClassesWithClass) => userClass.class.capsules || [],
        )

        // 状態を更新
        set({
          email,
          user: userWithoutClasses,
          userClasses: userClassesWithoutCapsules,
          capsules: allCapsules,
        })
      }
    } catch (error: any) {
      // ApolloErrorの場合だけセット
      if (error instanceof ApolloError) {
        set({ error })
      } else if (error.message === 'Email not found in cookies.') {
        set({
          error: new ApolloError({
            errorMessage: 'Email not found in cookies.',
          }),
        })
      } else {
        console.error('Unexpected error:', error)
        set({
          error: new ApolloError({
            errorMessage: 'Unexpected error occurred.',
          }),
        })
      }
    } finally {
      set({ loading: false })
    }
  },

  setClassMembers: async (class_id: string) => {
    set({ loading: true, error: undefined })

    try {
      const { data } = await client.query({
        query: GET_MEMBER,
        variables: { class_id },
        fetchPolicy: 'network-only',
      })

      if (data?.getMemberList) {
        set({ members: data.getMemberList })
      }
    } catch (error: any) {
      if (error instanceof ApolloError) {
        set({ error })
      } else {
        console.error('Unexpected error:', error)
      }
    } finally {
      set({ loading: false })
    }
  },
}))
