import Image from 'next/image'
import CheckIcon from './icon/CheckIcon'
import DeleteIcon from './icon/DeleteIcon'

// 引数の型を宣言する
type ListRowProps = {
  image: string
  uploaded_by: string
  type: string
}

export default function ListRow({ image, uploaded_by, type }: ListRowProps) {
  return (
    <div className="flex flex-row items-center space-x-4 hover:bg-hover p-2 rounded-2xl cursor-pointer">
      <Image
        src={image}
        alt={uploaded_by}
        width={75}
        height={75}
        className="w-[65px] h-[65px] object-cover rounded-2xl"
      />
      <span className="flex-1 font-bold">{uploaded_by}</span>
      <p className="flex-1 font-bold">{type}</p>
      <div className="flex gap-2">
        <button>
          <CheckIcon />
        </button>
        <button>
          <DeleteIcon />
        </button>
      </div>
    </div>
  )
}
