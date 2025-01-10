'use client'
import client from '@/lib/apolloClient'
import { get_cookie } from '@/lib/cookie'
import { GET_MEMBER } from '@/lib/queries/histories'
import { GET_FILES_IN_DIRECTORY } from '@/lib/queries/media'
import { GET_USER } from '@/lib/queries/users'
import {
  Capsule,
  Class,
  MediaFile,
  MemberItem,
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
  members: MemberItem[]
  mediaList: MediaFile[]
  loading: boolean
  error: ApolloError | undefined
  selectedClassId: string
  selectedOrganizationId: string
  selectedSchoolId: string
  setInit: () => Promise<void> // 初期化処理
  setClassMembers: (class_id: string) => Promise<void> // クラスメンバー情報取得
  setSelectedClassId: (index: string) => void
  setMediaList: (
    organization_id: string,
    school_id: string,
    class_id: string,
  ) => Promise<void>
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  email: null,
  user: null,
  userClasses: null,
  classList: null,
  capsules: null,
  capsulesByClass: {},
  members: [],
  mediaList: [],
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

        set({
          email,
          user: userWithoutClasses,
          userClasses: userClassesWithoutCapsules,
          classList: classes,
          capsules: allCapsules,
          capsulesByClass,
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
  ) => {
    set({ loading: true, error: undefined })

    try {
      const { data } = await client.query({
        query: GET_FILES_IN_DIRECTORY,
        variables: { organization_id, school_id, class_id },
        fetchPolicy: 'network-only',
      })

      if (data?.getFilesInDirectory) {
        set({ mediaList: data.getFilesInDirectory })
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
