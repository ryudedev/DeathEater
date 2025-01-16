export const dateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}.${month}.${day}`
}

export const calculateDateDifference = (targetDate: Date): string => {
  const now = new Date() // 現在の日付
  const differenceInMs = targetDate.getTime() - now.getTime() // ミリ秒単位での差分

  if (differenceInMs < 0) {
    return '過去の日付です' // 過去の日付の場合のエラーハンドリング
  }

  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)) // 日単位の差分
  const years = Math.floor(differenceInDays / 365) // 年数
  const days = differenceInDays % 365 // 年を引いた残りの日数

  return `${years}年${days}日`
}

export const isDateReached = (targetDate: string): boolean => {
  return new Date() >= new Date(targetDate)
}
