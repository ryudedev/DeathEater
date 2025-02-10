'use client'
import useStorage from '@/hooks/useStorage'
import useStorageConverter from '@/hooks/useStorageConverter'
import useUsagePercentage from '@/hooks/useUsagePercentage'
import { calculateDateDifference } from '@/lib/date'
import { Capsule, UsageProps } from '@/type'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from './button'
import Card from './card'
import MediaAdd from './mediaAdd'
import MediaBar from './mediaBar'
import { MediaItem, mediaType } from './mediaItem'

type CapsuleStorageProps = {
  capsules: Capsule[]
  type: 'transition' | 'add'
}

export const CapsuleStorage = ({ capsules, type }: CapsuleStorageProps) => {
  const router = useRouter()
  const { calculateUsagePercentage } = useUsagePercentage()
  const storage = useStorage()
  const { convertSize } = useStorageConverter()
  const [usagePercentage, setUsagePercentage] = useState<UsageProps | null>(
    null,
  )
  const [isUpload, setIsUpload] = useState<boolean>(false)
  const mediaArray = [
    mediaType.image,
    mediaType.video,
    mediaType.audio,
    mediaType.text,
    mediaType.free,
  ]

  const onClick = () => {
    if (type === 'transition') {
      router.push('/capsules')
    } else {
      setIsUpload(true)
    }
  }

  const handleCloseMediaAdd = () => {
    setIsUpload(false)
  }

  useEffect(() => {
    if (capsules && capsules.length) {
      const res = calculateUsagePercentage(capsules[capsules.length - 1].size!)
      setUsagePercentage(res)
    }
  }, [capsules])

  return (
    <>
      {isUpload && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <MediaAdd onClose={handleCloseMediaAdd} />
        </div>
      )}

      <Card flexDir="row" gap={2.5} className="p-6 items-center">
        <Button
          type="button"
          className="absolute -bottom-10 -right-10 w-[78px] h-[78px] items-start justify-start px-4 py-4"
          onClick={onClick}
        >
          <Image
            src={
              type === 'transition'
                ? '/images/arrow-right-white.svg'
                : '/images/Plus.svg'
            }
            alt="next page"
            width={24}
            height={24}
            className=""
          />
        </Button>
        <div className="flex-1 flex px-2.5 py-2.5 justify-center">
          <Image
            src="/images/Capsule.svg"
            alt="Capsule"
            width={148}
            height={61}
            className="w-full h-full max-h-[148px]"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2.5">
          <h3 className="text-xl font-bold">
            {capsules[capsules.length - 1].name}
          </h3>
          <div className="flex flex-col gap-1 justify-end">
            {usagePercentage && storage && (
              <MediaBar
                imageRatio={usagePercentage.percentages['画像']}
                imageType={convertSize(storage['画像']).unit}
                image={Number(convertSize(storage['画像']).value)}
                audioRatio={usagePercentage.percentages['音声']}
                audioType={convertSize(storage['音声']).unit}
                audio={Number(convertSize(storage['音声']).value)}
                videoRatio={usagePercentage.percentages['動画']}
                videoType={convertSize(storage['動画']).unit}
                video={Number(convertSize(storage['動画']).value)}
                textRatio={usagePercentage.percentages['テキスト']}
                textType={convertSize(storage['テキスト']).unit}
                text={Number(convertSize(storage['テキスト']).value)}
                free={usagePercentage.remainingStorage.remainingStorageGB}
                freeType="GB"
                freeRatio={
                  usagePercentage.remainingStorage.remainingStoragePercentage
                }
              />
            )}
            <span className="text-description">
              {calculateDateDifference(
                new Date(capsules[capsules.length - 1].release_date!),
              )}
            </span>
          </div>
          <div className="flex flex-wrap gap-[18px]">
            {mediaArray.map((type) => (
              <MediaItem type={type} key={type} />
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}
