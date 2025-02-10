'use client'

import useSizeConverter from './useSizeConverter'
import useStorage from './useStorage'

export default function useUsagePercentage() {
  const storageUsage = useStorage() // カテゴリごとの使用容量
  const { convertSizeToGB } = useSizeConverter()

  /**
   * 使用割合を計算
   * @param sizeKey - "small" | "medium" | "large"
   * @returns { [category: string]: number } - カテゴリごとの使用割合（%）
   */
  const calculateUsagePercentage = (sizeKey: 'small' | 'medium' | 'large') => {
    const totalCapacityGB = convertSizeToGB(sizeKey) // 総容量 (GB)
    const percentages: { [category: string]: number } = {}

    // カテゴリごとの割合を計算
    ;(
      Object.keys(storageUsage) as Array<
        '画像' | '動画' | '音声' | 'テキスト' | '合計'
      >
    ).forEach((category) => {
      if (category !== '合計') {
        const usageInGB = storageUsage[category] / (1024 * 1024 * 1024) // KB -> GBに変換
        // totalCapacityGBのうち、usageInGBが何%か計算
        percentages[category] = (usageInGB / totalCapacityGB) * 100
      }
    })

    const usedStorageGB = storageUsage['合計'] / (1024 * 1024 * 1024)
    const remainingStorageGB = totalCapacityGB - usedStorageGB
    const remainingStorage = {
      remainingStoragePercentage: (remainingStorageGB / totalCapacityGB) * 100,
      remainingStorageGB,
    }

    return {
      percentages,
      remainingStorage,
    }
  }

  return { calculateUsagePercentage }
}
