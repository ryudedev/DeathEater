'use client'
import { calculateDateDifference } from '@/lib/date'
import { Capsule } from '@/type'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Button from './button'
import Card from './card'
import MediaBar from './mediaBar'
import { MediaItem, mediaType } from './mediaItem'

type CapsuleStorageProps = {
  capsules: Capsule[]
  type: 'transition' | 'add'
}

export const CapsuleStorage = ({ capsules, type }: CapsuleStorageProps) => {
  const router = useRouter()
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
    }
  }

  return (
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
          <MediaBar image={24} audio={8} video={18} text={13} free={37} />
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
  )
}
