import { calculateDateDifference } from '@/lib/date'
import { Capsule } from '@/type'
import Image from 'next/image'
import Card from './card'
import MediaBar from './mediaBar'
import { MediaItem, mediaType } from './mediaItem'

type CapsuleStorageProps = {
  capsules: Capsule[]
}

export const CapsuleStorage = ({ capsules }: CapsuleStorageProps) => {
  const mediaArray = [
    mediaType.image,
    mediaType.video,
    mediaType.audio,
    mediaType.text,
    mediaType.free,
  ]

  return (
    <Card flexDir="row" gap={2.5} className="p-6 items-center">
      <div className="flex-1 flex px-2.5 py-2.5 justify-center">
        <Image
          src="/Capsule.svg"
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
