import {
  STACK_DELETE_MEDIA,
  STACK_GET_FILES_IN_DIRECTORY,
  STACK_MOVE_FILE,
} from '@/lib/queries/stacks'
import { useDashboardStore } from '@/store'
import { useMutation } from '@apollo/client'
import Image from 'next/image'
import CheckIcon from './icon/CheckIcon'
import DeleteIcon from './icon/DeleteIcon'

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
  const {
    selectedOrganizationId,
    selectedSchoolId,
    selectedClassId,
    capsules,
    setMediaList,
  } = useDashboardStore()

  // Get the last capsule safely
  const lastCapsuleId =
    capsules && capsules.length > 0 ? capsules[capsules.length - 1].id : null

  const [deleteMedia] = useMutation(STACK_DELETE_MEDIA, {
    refetchQueries: [
      {
        query: STACK_GET_FILES_IN_DIRECTORY,
        variables: {
          organization_id: selectedOrganizationId,
          school_id: selectedSchoolId,
          class_id: selectedClassId,
          capsule_id: lastCapsuleId,
        },
      },
    ],
    onCompleted: () => {
      if (
        selectedOrganizationId &&
        selectedSchoolId &&
        selectedClassId &&
        lastCapsuleId
      ) {
        setMediaList(
          selectedOrganizationId,
          selectedSchoolId,
          selectedClassId,
          lastCapsuleId,
        )
      }
    },
  })

  const [moveMedia] = useMutation(STACK_MOVE_FILE, {
    refetchQueries: [
      {
        query: STACK_GET_FILES_IN_DIRECTORY,
        variables: {
          organization_id: selectedOrganizationId || '',
          school_id: selectedSchoolId,
          class_id: selectedClassId,
          capsule_id: lastCapsuleId,
        },
      },
    ],
    onCompleted: () => {
      if (
        selectedOrganizationId &&
        selectedSchoolId &&
        selectedClassId &&
        lastCapsuleId
      ) {
        setMediaList(
          selectedOrganizationId,
          selectedSchoolId,
          selectedClassId,
          lastCapsuleId,
        )
      }
    },
  })

  const handleDelete = async () => {
    try {
      if (
        !selectedOrganizationId ||
        !selectedSchoolId ||
        !selectedClassId ||
        !lastCapsuleId
      )
        return

      await deleteMedia({
        variables: {
          key: delKey,
          capsule_id: lastCapsuleId,
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
        !lastCapsuleId
      )
        return

      await moveMedia({
        variables: {
          organization_id: selectedOrganizationId,
          school_id: selectedSchoolId,
          class_id: selectedClassId,
          key: delKey,
          capsule_id: lastCapsuleId,
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
