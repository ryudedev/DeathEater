// 使用量の総計を引数として取得し、使用量が一定の値を超えた場合にアラートを表示するコンポーネント
'use client'
import { useEffect, useState } from 'react'
import PlusIcon from './icon/plusIcon'

type UsageAlertProps = {
  totalUsage?: number
  isClose?: boolean
  children?: string
}

export default function UsageAlert({
  totalUsage,
  isClose = false,
  children,
}: UsageAlertProps) {
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertBorderColor, setAlertBorderColor] = useState<string>(
    'border-alert_border_text_90',
  )
  const [alertTextColor, setAlertTextColor] = useState<string>(
    'text-alert_border_text_90',
  )
  const [alertBackgroundColor, setAlertBackgroundColor] =
    useState<string>('bg-alert_bg_90')
  useEffect(() => {
    if (totalUsage) {
      if (totalUsage >= 90) {
        setAlertMessage(
          '現在の使用量は全体の90%を超えています。直ちに不要なデータを削除してください。',
        )
        setAlertBorderColor('border-alert_border_text_90')
        setAlertTextColor('text-alert_border_text_90')
        setAlertBackgroundColor('bg-alert_bg_90')
      } else if (totalUsage >= 80) {
        setAlertMessage(
          '現在の使用量は全体の80%を超えています。このままでは容量が不足する可能性があります。',
        )
        setAlertBorderColor('border-alert_border_text_80')
        setAlertTextColor('text-alert_border_text_80')
        setAlertBackgroundColor('bg-alert_bg_80')
      } else if (totalUsage >= 70) {
        setAlertMessage(
          '現在の使用量は全体の70%を超えています。引き続きご注意ください。',
        )
        setAlertBorderColor('border-alert_border_text_70')
        setAlertTextColor('text-alert_border_text_70')
        setAlertBackgroundColor('bg-alert_bg_70')
      } else if (totalUsage >= 60) {
        setAlertMessage(
          '現在の使用量は全体の60%を超えています。引き続きご注意ください。',
        )
        setAlertBorderColor('border-alert_border_text_60')
        setAlertTextColor('text-alert_border_text_60')
        setAlertBackgroundColor('bg-alert_bg_60')
      }
    }
  }, [totalUsage])
  return (
    <div
      className={`w-full flex flex-row gap-2.5 p-4 items-center justify-between rounded-lg border ${alertBorderColor} ${alertBackgroundColor}`}
    >
      <p className={`font-bold ${alertTextColor}`}>
        {alertMessage || children}
      </p>
      {isClose && <PlusIcon rotate={45} color="#363853" />}
    </div>
  )
}
