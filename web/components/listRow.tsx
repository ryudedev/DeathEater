import { STACK_DELETE_MEDIA, STACK_MOVE_FILE } from '@/lib/queries/stacks'
import { useDashboardStore } from '@/store'
import { useMutation } from '@apollo/client'
import Image from 'next/image'
import CheckIcon from './icon/CheckIcon'
import DeleteIcon from './icon/DeleteIcon'

// 引数の型を宣言する
type ListRowProps = {
  image: string
  uploaded_by: string
  type: string
  delKey: string
  user_id: string
}

export default function ListRow({
  image,
  uploaded_by,
  type,
  delKey,
  user_id,
}: ListRowProps) {
  const [deleteMedia] = useMutation(STACK_DELETE_MEDIA)
  const [moveMedia] = useMutation(STACK_MOVE_FILE)
  const {
    selectedOrganizationId,
    selectedSchoolId,
    selectedClassId,
    capsules,
  } = useDashboardStore()

  const handleDelete = async () => {
    try {
      if (
        !selectedOrganizationId ||
        !selectedSchoolId ||
        !selectedClassId ||
        !capsules
      )
        return
      await deleteMedia({
        variables: {
          key: delKey,
          capsule_id: capsules[capsules.length - 1].id,
          uploaded_by: user_id,
        },
      })
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const handleCheck = async () => {
    try {
      if (
        !selectedOrganizationId ||
        !selectedSchoolId ||
        !selectedClassId ||
        !capsules
      )
        return
      console.log(user_id)
      await moveMedia({
        variables: {
          organization_id: selectedOrganizationId,
          school_id: selectedSchoolId,
          class_id: selectedClassId,
          key: delKey,
          capsule_id: capsules[capsules.length - 1].id,
          uploaded_by: uploaded_by,
          user_id,
        },
      })
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }
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
        <button onClick={handleCheck}>
          <CheckIcon />
        </button>
        <button onClick={handleDelete}>
          <DeleteIcon />
        </button>
      </div>
    </div>
  )
}
