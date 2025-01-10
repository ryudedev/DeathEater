import ChevronIcon from './chevronIcon'

type MediaListItemProps = {
  onClick: () => void
  mediaType: string
  usage: number
}

export default function MediaListItem({
  onClick,
  mediaType,
  usage,
}: MediaListItemProps) {
  const color =
    mediaType === '画像'
      ? 'bg-image'
      : mediaType === '動画'
        ? 'bg-movie'
        : mediaType === '音声'
          ? 'bg-voice'
          : 'bg-text'
  return (
    <div
      className="flex flex-row justify-between px-4 py-2 items-center hover:bg-hover rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-row gap-2.5 items-center">
        {/* bgの色はメディアによって変更する */}
        <div className={`w-2.5 h-2.5 ${color}`} />
        {/* メディアタイプによって変更する */}
        <p>{mediaType}</p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        {/* メディアによって使用量は変更する */}
        <p className="text-description">{usage}MB使用</p>
        <ChevronIcon />
      </div>
    </div>
  )
}
