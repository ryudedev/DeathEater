'use client'

export default function useStorageConverter() {
  /**
   * 容量を適切な単位に変換する
   * @param sizeInKB - KB単位の容量
   * @returns { value: number, unit: string } - 変換後の数値と単位
   */
  const convertSize = (sizeInKB: number) => {
    if (sizeInKB >= 1024 * 1024 * 1024) {
      return { value: (sizeInKB / (1024 * 1024 * 1024)).toFixed(2), unit: 'GB' }
    } else if (sizeInKB >= 1024 * 1024) {
      return { value: (sizeInKB / (1024 * 1024)).toFixed(2), unit: 'MB' }
    } else if (sizeInKB >= 1024) {
      return { value: (sizeInKB / 1024).toFixed(2), unit: 'KB' }
    } else {
      return { value: sizeInKB.toFixed(2), unit: 'B' }
    }
  }

  return { convertSize }
}
