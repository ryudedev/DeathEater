'use client'
import Card from '@/components/card'
import Header from '@/components/header'
import StorageRow from '@/components/storageRow'
import useSizeConverter from '@/hooks/useSizeConverter'
import useStorage from '@/hooks/useStorage'
import useStorageConverter from '@/hooks/useStorageConverter'
import { useDashboardStore } from '@/store'
import { useEffect, useState } from 'react'

type StorageSizeProps = {
  value: string
  unit: string
}

export default function Storage() {
  const [storageSize, setStorageSize] = useState<StorageSizeProps>({
    value: '0',
    unit: 'KB',
  })

  const storage = useStorage()
  const { capsules } = useDashboardStore()
  const { convertSize } = useStorageConverter()
  const { convertSizeToGB } = useSizeConverter()
  useEffect(() => {
    const { value, unit } = convertSize(storage['合計'])
    setStorageSize({ value, unit })
  }, [storage, convertSize])
  return (
    <>
      <Header showBackButton title="ストレージ詳細" />
      {storage && (
        <div className="p-4">
          <Card className="w-full p-4 gap-6 justify-center">
            <p className="text-base font-bold">使用中の容量</p>
            <div className="flex flex-row justify-between items-end h-9">
              <p className="text-5xl font-bold h-9">
                {storageSize.value} {storageSize.unit}
              </p>
              <div className="h-full w-[1px] bg-border rotate-12" />
              <p className="text-description">
                {capsules?.length &&
                  convertSizeToGB(capsules[capsules.length - 1].size!)}
                GB
              </p>
            </div>
            <div className="w-full h-[1px] bg-border rounded-full" />
            <StorageRow
              type="画像"
              size={Number(convertSize(storage['画像']).value)}
              unit={convertSize(storage['画像']).unit}
            />
            <StorageRow
              type="動画"
              size={Number(convertSize(storage['動画']).value)}
              unit={convertSize(storage['動画']).unit}
            />
            <StorageRow
              type="音声"
              size={Number(convertSize(storage['音声']).value)}
              unit={convertSize(storage['音声']).unit}
            />
            <StorageRow
              type="テキスト"
              size={Number(convertSize(storage['テキスト']).value)}
              unit={convertSize(storage['テキスト']).unit}
            />
          </Card>
        </div>
      )}
    </>
  )
}
