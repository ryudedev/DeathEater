'use client'
import Button from '@/components/button'
import Card from '@/components/card'
import ImageCheckbox from '@/components/galleryt'
import Header from '@/components/header'
import { DELETE_MEDIA, GET_FILES_IN_DIRECTORY } from '@/lib/queries/media'
import { useDashboardStore } from '@/store'
import { GetFilesInDirectoryResponse } from '@/type'
import { useMutation, useQuery } from '@apollo/client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Media: React.FC = () => {
  // チェックボックス表示の状態を管理
  const [showCheckbox, setShowCheckbox] = useState(false)
  const {
    selectedOrganizationId,
    selectedSchoolId,
    selectedClassId,
    capsules,
    setMediaList,
  } = useDashboardStore()

  const { data } = useQuery<GetFilesInDirectoryResponse>(
    GET_FILES_IN_DIRECTORY,
    {
      variables: {
        organization_id: selectedOrganizationId,
        school_id: selectedSchoolId,
        class_id: selectedClassId,
      },
    },
  )

  const [deleteMedia] = useMutation(DELETE_MEDIA, {
    onCompleted: () => {
      if (
        capsules?.length &&
        selectedOrganizationId &&
        selectedSchoolId &&
        selectedClassId
      ) {
        setMediaList(
          selectedOrganizationId,
          selectedSchoolId,
          selectedClassId,
          capsules[capsules.length - 1].id!,
        )
      }
    },
  })

  // 各画像のチェック状態を管理
  const [checkedStates, setCheckedStates] = useState<Record<
    string,
    boolean
  > | null>()

  useEffect(() => {
    if (data?.getFilesInDirectory) {
      setCheckedStates(
        Object.fromEntries(
          data.getFilesInDirectory.map((photo) => [photo.key, false]),
        ),
      )
      console.log(data.getFilesInDirectory)
    }
  }, [data])

  // 削除確認画面の表示状態
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  // ヘルパー: チェックされた写真があるかを確認
  const hasCheckedPhotos =
    checkedStates && typeof checkedStates === 'object'
      ? Object.values(checkedStates).some(Boolean)
      : false

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    if (!showCheckbox) return
    setCheckedStates((prev) => ({
      ...prev,
      [id]: isChecked,
    }))
  }

  const toggleCheckboxVisibility = () => {
    if (showCheckbox && data?.getFilesInDirectory) {
      // チェック状態をリセット
      setCheckedStates(
        Object.fromEntries(
          data.getFilesInDirectory.map((photo) => [photo.key, false]),
        ),
      )
      setShowCheckbox(false)
    } else {
      setShowCheckbox(true)
    }
  }

  // const deleteSelectedPhotos = () => {
  //   setPhotoData((prev) => prev.filter((photo) => !checkedStates[photo.key]))
  //   // チェック状態と確認画面をリセット
  //   setCheckedStates(
  //     Object.fromEntries(photoData.map((photo) => [photo.key, false])),
  //   )
  //   setShowDeleteConfirmation(false)
  //   setShowCheckbox(false)
  // }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (!capsules?.length || !checkedStates) return
      const selectedMediaKeys = Object.entries(checkedStates || {})
        .filter(([, isChecked]) => isChecked)
        .map(([key]) => key)

      // Then in your deleteMedia mutation
      selectedMediaKeys.map((key) => {
        const res = deleteMedia({
          variables: {
            key,
            organization_id: selectedOrganizationId,
            school_id: selectedSchoolId,
            class_id: selectedClassId,
            capsule_id: capsules[capsules.length - 1].id,
          },
        })
        console.log(res)
      })

      setShowDeleteConfirmation(false)
      setShowCheckbox(false)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="メディア一覧" showBackButton />
      <div className="pt-6 px-6 relative">
        <Card
          gap={7}
          className="h-[704px] pt-[100px] flex flex-wrap items-center overflow-y-auto"
        >
          {/* レスポンシブなグリッドレイアウト */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1">
            {data?.getFilesInDirectory &&
              data.getFilesInDirectory.map((photo) => (
                <ImageCheckbox
                  key={photo.key}
                  imageUrl={photo.url}
                  label={photo.name}
                  onChange={(isChecked) =>
                    handleCheckboxChange(photo.key, isChecked)
                  }
                  showCheckbox={showCheckbox}
                  isChecked={checkedStates ? checkedStates[photo.key] : false} // チェック状態を渡す
                  deletable={photo.deletable}
                />
              ))}
          </div>
          <Button
            onClick={() =>
              hasCheckedPhotos
                ? setShowDeleteConfirmation(true)
                : toggleCheckboxVisibility()
            }
            className={`absolute w-[80px] h-[80px] flex -right-6 -top-[27px] ${
              hasCheckedPhotos
                ? 'bg-[#FF6262] border-[#FF6262]'
                : showCheckbox
                  ? 'bg-[#FF6262] border-[#FF6262]'
                  : 'bg-[#441AFF]'
            } transition duration-300 font-semibold rounded-full px-5 py-2 items-center justify-center`}
          >
            <Image
              src={
                hasCheckedPhotos
                  ? '/images/tick.svg'
                  : showCheckbox
                    ? '/images/close.svg'
                    : '/images/trash.svg'
              }
              alt="Icon"
              className="absolute mt-5 mr-5"
              width={24}
              height={24}
            />
          </Button>
        </Card>
        {showDeleteConfirmation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 px-5">
            <Card className="bg-white p-6 rounded-lg flex flex-col items-center space-y-4 border-2 border-[#FF6262]">
              <Image
                src="/images/warning.svg"
                alt="Warning"
                width={48}
                height={48}
              />
              <div className="text-xs font-semibold text-center">
                申請すると取り消しすることはできませんが、本当に削除申請してもよろしいですか?
              </div>
              <div className="relative w-full h-full flex justify-between">
                <Button
                  onClick={(e) => handleDelete(e)}
                  className="absolute w-[80px] h-[80px] -left-14 -bottom-14 bg-error border-error p-3 rounded-full"
                >
                  <Image
                    src="/images/trash.svg"
                    alt="Delete Icon"
                    width={24}
                    height={24}
                    className="mt-1 ml-6"
                  />
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="absolute w-[80px] h-[80px] -right-14 -bottom-14 bg-white border-2 border-error p-3 rounded-full"
                >
                  <Image
                    src="/images/close-r.svg"
                    alt="Close Icon"
                    width={24}
                    height={24}
                    className="mt-1 ml-2"
                  />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Media
