import { Capsule } from '@/type'
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
