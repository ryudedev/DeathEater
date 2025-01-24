'use client'

export default function useSizeConverter() {
  /**
   * サイズキーをGBに変換する
   * @param sizeKey - "small" | "medium" | "large"
   * @returns number - GB単位の容量
   */
  const convertSizeToGB = (sizeKey: 'small' | 'medium' | 'large'): number => {
    const sizeMap = {
      small: 2,
      medium: 5,
      large: 10,
    }

    return sizeMap[sizeKey]
  }

  return { convertSizeToGB }
}
