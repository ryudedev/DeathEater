import { MediaTypeProps } from '@/lib/testData'

export default function MediaItemRow({
  name,
  type,
  uploadedAt,
  onClick,
  ...props
}: Omit<MediaTypeProps, 'id'> & { onClick: () => void }) {
  return (
    <div
      className="flex flex-row items-center gap-4 font-bold p-4 hover:bg-hover cursor-pointer rounded-lg"
      onClick={onClick}
      {...props}
    >
      <p className="flex-1">{name}</p>
      <p className="flex-1">{type}</p>
      <p className="flex-1">{uploadedAt}</p>
    </div>
  )
}
