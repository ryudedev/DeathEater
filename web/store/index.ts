'use client'
import client from '@/lib/apolloClient'
import { get_cookie } from '@/lib/cookie'
import { GET_MEMBER } from '@/lib/queries/histories'
import { GET_FILES_IN_DIRECTORY } from '@/lib/queries/media'
import { STACK_GET_FILES_IN_DIRECTORY } from '@/lib/queries/stacks'
import { GET_USER } from '@/lib/queries/users'
import {
  Capsule,
  Class,
  MediaDataProps,
  MediaFile,
  MemberItem,
  StackProps,
  User,
  UserClassesWithClass,
} from '@/type'
import { ApolloError } from '@apollo/client'
import { create } from 'zustand'

type DashboardStore = {
  email: string | null
  user: User | null
  userClasses: UserClassesWithClass[] | null
  classList: Class[] | null
  capsules: Capsule[] | null
  capsulesByClass: Record<string, Capsule[]> // クラスごとに分けられたカプセル
  stackList: StackProps[] | null
  members: MemberItem[]
  mediaList: MediaFile[]
  MediaData: MediaDataProps[]
  loading: boolean
  error: ApolloError | undefined
  selectedClassId: string
  selectedOrganizationId: string
  selectedSchoolId: string
  // メディアごとの容量を格納
  setInit: () => Promise<void> // 初期化処理
  setClassMembers: (class_id: string) => Promise<void> // クラスメンバー情報取得
  setSelectedClassId: (index: string) => void
  setMediaList: (
    organization_id: string,
    school_id: string,
    class_id: string,
    capsule_id: string,
  ) => Promise<void>
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  email: null,
  user: null,
  userClasses: null,
  classList: null,
  capsules: null,
  capsulesByClass: {},
  stackList: [],
  members: [],
  mediaList: [],
  MediaData: [],
  loading: false,
  error: undefined,
  selectedClassId: '',
  selectedOrganizationId: '',
  selectedSchoolId: '',

  setInit: async () => {
    set({ loading: true, error: undefined })

    try {
      const email = await get_cookie('email')
      if (!email) throw new Error('Email not found in cookies.')

      const { data } = await client.query({
        query: GET_USER,
        variables: { email },
        fetchPolicy: 'network-only',
      })

      const userData = data.findUserByEmail
      if (userData) {
        const { userClasses, ...userWithoutClasses } = userData

        const userClassesWithoutCapsules: UserClassesWithClass[] =
          userClasses?.map((userClass: UserClassesWithClass) => ({
            ...userClass,
            class: {
              ...userClass.class,
              capsules: undefined,
            },
          }))

        const allCapsules: Capsule[] = userClasses?.flatMap(
          (userClass: UserClassesWithClass) => userClass.class.capsules || [],
        )

        const classes: Class[] = userClasses?.map(
          (userClass: UserClassesWithClass) => userClass.class,
        )

        const capsulesByClass: Record<string, Capsule[]> = {}
        classes?.forEach((classItem) => {
          capsulesByClass[classItem.id!] =
            allCapsules?.filter(
              (capsule: Capsule) => capsule.class_id === classItem.id,
            ) || []
        })

        // Set initial selected IDs from the first available class
        const firstClass = classes?.[0]
        const initialClassId = firstClass?.id || ''
        const initialOrganizationId = firstClass?.school?.organization_id || ''
        const initialSchoolId = firstClass?.school_id || ''

        set({
          email,
          user: userWithoutClasses,
          userClasses: userClassesWithoutCapsules,
          classList: classes,
          capsules: allCapsules,
          capsulesByClass,
          selectedClassId: initialClassId,
          selectedOrganizationId: initialOrganizationId,
          selectedSchoolId: initialSchoolId,
        })
      }
    } catch (error: any) {
      if (error instanceof ApolloError) {
        set({ error })
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

  setSelectedClassId: (classId: string) => {
    const state = get()
    const selectedClass = state.classList?.find(
      (classItem) => classItem.id === classId,
    )

    if (selectedClass) {
      const organizationId = selectedClass.school?.organization_id || ''
      const schoolId = selectedClass.school_id || ''

      set({
        selectedClassId: classId,
        selectedOrganizationId: organizationId,
        selectedSchoolId: schoolId,
      })
    } else {
      set({
        selectedClassId: '',
        selectedOrganizationId: '',
        selectedSchoolId: '',
      })
    }
  },

  setMediaList: async (
    organization_id: string,
    school_id: string,
    class_id: string,
    capsule_id: string,
  ) => {
    set({ loading: true, error: undefined })

    try {
      const [directoryData, stackData] = await Promise.all([
        client.query({
          query: GET_FILES_IN_DIRECTORY,
          variables: { organization_id, school_id, class_id },
          fetchPolicy: 'network-only',
        }),
        client.query({
          query: STACK_GET_FILES_IN_DIRECTORY,
          variables: { organization_id, school_id, class_id, capsule_id },
          fetchPolicy: 'network-only',
        }),
      ])

      if (stackData?.data?.stackGetFilesInDirectory) {
        set({
          stackList: stackData.data.stackGetFilesInDirectory,
        })
      }

      if (directoryData?.data?.getFilesInDirectory) {
        set({ mediaList: directoryData.data.getFilesInDirectory })

        // category_size の型定義
        const categorie_size = directoryData.data.getFilesInDirectory.reduce(
          (acc: Record<string, number>, item: any) => {
            const category = item.category
            if (category) {
              acc[category] = (acc[category] || 0) + item.size
            }
            return acc
          },
          { 画像: 0, 動画: 0, 音声: 0, テキスト: 0 },
        )

        const MediaData = (
          Object.entries(categorie_size) as [string, number][]
        ).map(([key, value]) => {
          const color =
            key === '画像'
              ? '#00ff00'
              : key === '動画'
                ? '#002bff'
                : key === '音声'
                  ? '#800080'
                  : '#000000'
          const mg_size = value / 1024 / 1024
          const size =
            mg_size >= 1
              ? parseFloat(mg_size.toFixed(2))
              : parseFloat(mg_size.toPrecision(1))
          return {
            label: key,
            value: size,
            color: color,
          }
        })

        set({ MediaData })
      }

      // stackData の利用が必要であればここで処理を追加
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
