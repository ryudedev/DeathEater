'use client'
import { DELETE_MEDIA } from '@/lib/queries/media'
import { useDashboardStore } from '@/store'
import { MediaTypeProps } from '@/type'
import { useMutation } from '@apollo/client'
import Trash from './icon/Trash'

export default function MediaItemRow({
  name,
  type,
  uploadedAt,
  onClick,
  filePath,
  deletable,
  ...props
}: Omit<MediaTypeProps, 'id'> & { onClick: () => void }) {
  const {
    selectedOrganizationId,
    selectedClassId,
    selectedSchoolId,
    capsules,
  } = useDashboardStore()
  const [deleteMedia] = useMutation(DELETE_MEDIA)

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    try {
      if (!capsules?.length) return
      deleteMedia({
        variables: {
          organization_id: selectedOrganizationId,
          school_id: selectedSchoolId,
          class_id: selectedClassId,
          capsule_id: capsules[0].id,
          key: filePath,
        },
      })
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  return (
    <div
      className="flex flex-row items-center gap-4 font-bold p-4 hover:bg-hover cursor-pointer rounded-lg"
      onClick={onClick}
      {...props}
    >
      <p className="flex-1">{name}</p>
      <p className="flex-1">{type}</p>
      <p className="flex-1">{uploadedAt}</p>
      <div
        className={`flex-1 cursor-pointer`}
        onClick={(e) => deletable && handleDelete(e)}
      >
        {deletable && <Trash color={!deletable ? '#c0c0c0' : '#441aff'} />}
      </div>
    </div>
  )
}
