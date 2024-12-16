export enum mediaType {
  image = 'image',
  video = 'video',
  audio = 'audio',
  text = 'text',
  free = 'free',
}

type MediaItemProps = {
  type: mediaType
}

export const MediaItem = ({ type }: MediaItemProps) => {
  const media = [
    {
      type: 'image',
      desc: '画像',
      color: 'bg-image',
    },
    {
      type: 'video',
      desc: '動画',
      color: 'bg-movie',
    },
    {
      type: 'audio',
      desc: '音声',
      color: 'bg-voice',
    },
    {
      type: 'text',
      desc: 'テキスト',
      color: 'bg-text',
    },
    {
      type: 'free',
      desc: '空き容量',
      color: 'bg-free',
    },
  ]

  const item = media.find((item) => item.type === type)
  return (
    <div className="flex flex-row gap-2.5">
      <div
        className={`w-2.5 h-2.5 ${item?.color} rounded-full overflow-hidden`}
      />
      <span className="text-xs">{item?.desc}</span>
    </div>
  )
}
