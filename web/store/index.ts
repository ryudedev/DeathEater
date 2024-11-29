import { Capsule, User, UserClassesWithoutCapsules } from '@/type'
import { create } from 'zustand'

// Zustand ストアの型定義
type useCapsulesType = {
  capsules: Capsule[] | null | undefined // 複数のカプセルを保持する状態
  setCapsules: (capsule: Capsule[]) => void // カプセルを追加する関数
}

export const useCapsules = create<useCapsulesType>((set) => ({
  capsules: [],
  setCapsules: (capsules) => set({ capsules }),
}))

type useUserType = {
  user: Omit<User, 'userClasses'> | null | undefined
  setUser: (user: Omit<User, 'userClasses'>) => void
}

export const useUser = create<useUserType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

type useUserClassesType = {
  userClasses: UserClassesWithoutCapsules[] | null | undefined
  setUserClasses: (user: UserClassesWithoutCapsules[]) => void
}

export const useUserClasses = create<useUserClassesType>((set) => ({
  userClasses: null,
  setUserClasses: (userClasses) => set({ userClasses }),
}))
