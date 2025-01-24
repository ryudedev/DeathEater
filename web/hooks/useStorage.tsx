'use client'

import { useDashboardStore } from '@/store'
import { useEffect } from 'react'

export default function useStorage() {
  const {
    selectedOrganizationId,
    selectedSchoolId,
    selectedClassId,
    mediaList,
    setMediaList,
  } = useDashboardStore()

  useEffect(() => {
    if (
      mediaList.length === 0 &&
      selectedOrganizationId &&
      selectedSchoolId &&
      selectedClassId
    ) {
      setMediaList(
        selectedOrganizationId,
        selectedSchoolId,
        selectedClassId,
        '',
      )
    }
  }, [mediaList, selectedOrganizationId, selectedSchoolId, selectedClassId])

  // カテゴリごとの総量を計算
  const storageUsage = mediaList.reduce(
    (acc, file) => {
      switch (file.category) {
        case '画像':
          acc['画像'] += file.size
          break
        case '動画':
          acc['動画'] += file.size
          break
        case '音声':
          acc['音声'] += file.size
          break
        case 'テキスト':
          acc['テキスト'] += file.size
          break
        default:
          break
      }
      return acc
    },
    {
      画像: 0,
      動画: 0,
      音声: 0,
      テキスト: 0,
      合計: 0,
    },
  )

  storageUsage['合計'] = Object.values(storageUsage).reduce(
    (acc, size) => acc + size,
    0,
  )
  return storageUsage
}
