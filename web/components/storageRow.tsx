type StorageRowProps = {
  type: string
  size: number
  unit: string
}

export default function StorageRow({ type, size, unit }: StorageRowProps) {
  const mediaType =
    type === '画像'
      ? 'image'
      : type === '動画'
        ? 'movie'
        : type === '音声'
          ? 'voice'
          : type === 'テキスト'
            ? 'text'
            : 'free'
  return (
    <div className="flex flex-row gap-2.5 items-center justify-between">
      <div className="flex flex-row gap-2 items-center">
        <div
          className={`w-2.5 h-2.5 bg-${mediaType} rounded-[2px] overflow-hidden`}
        />
        <p>{type}</p>
      </div>
      <span className="text-base text-description">
        {size} {unit}
      </span>
    </div>
  )
}
