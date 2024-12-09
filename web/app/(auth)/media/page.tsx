'use client'
import Button from '@/components/button'
import Card from '@/components/card'
import ImageCheckbox from '@/components/galleryt'
import Header from '@/components/header'
import Image from 'next/image'
import React, { useState } from 'react'

const Media: React.FC = () => {
  // チェックボックス表示の状態を管理
  const [showCheckbox, setShowCheckbox] = useState(false)

  // 写真データ（配列）
  const [photoData, setPhotoData] = useState([
    { id: '1', imageUrl: 'https://via.placeholder.com/75', label: 'Image 1' },
    { id: '2', imageUrl: 'https://via.placeholder.com/75', label: 'Image 2' },
    { id: '3', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '4', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '5', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '6', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '7', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '8', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '9', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '10', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '11', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
  ])

  // 各画像のチェック状態を管理
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>(
    Object.fromEntries(photoData.map((photo) => [photo.id, false])),
  )

  // 削除確認画面の表示状態
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  // ヘルパー: チェックされた写真があるかを確認
  const hasCheckedPhotos = Object.values(checkedStates).some(Boolean)

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    if (!showCheckbox) return
    setCheckedStates((prev) => ({
      ...prev,
      [id]: isChecked,
    }))
  }

  const toggleCheckboxVisibility = () => {
    if (showCheckbox) {
      // チェック状態をリセット
      setCheckedStates(
        Object.fromEntries(photoData.map((photo) => [photo.id, false])),
      )
      setShowCheckbox(false)
    } else {
      setShowCheckbox(true)
    }
  }

  const deleteSelectedPhotos = () => {
    setPhotoData((prev) => prev.filter((photo) => !checkedStates[photo.id]))
    // チェック状態と確認画面をリセット
    setCheckedStates(
      Object.fromEntries(photoData.map((photo) => [photo.id, false])),
    )
    setShowDeleteConfirmation(false)
    setShowCheckbox(false)
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
            {photoData.map((photo) => (
              <ImageCheckbox
                key={photo.id}
                imageUrl={photo.imageUrl}
                label={photo.label}
                onChange={(isChecked) =>
                  handleCheckboxChange(photo.id, isChecked)
                }
                showCheckbox={showCheckbox}
                isChecked={checkedStates[photo.id]} // チェック状態を渡す
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
                  ? '/tick.svg'
                  : showCheckbox
                    ? '/close.svg'
                    : '/trash.svg'
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
              <Image src="/warning.svg" alt="Warning" width={48} height={48} />
              <div className="text-xs font-semibold text-center">
                申請すると取り消しすることはできませんが、本当に削除申請してもよろしいですか?
              </div>
              <div className="relative w-full h-full flex justify-between">
                <Button
                  onClick={deleteSelectedPhotos}
                  className="absolute w-[80px] h-[80px] -left-14 -bottom-14 bg-[#FF6262] border-[#FF6262] p-3 rounded-full"
                >
                  <Image
                    src="/trash.svg"
                    alt="Delete Icon"
                    width={24}
                    height={24}
                    className="mt-1 ml-6"
                  />
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="absolute w-[80px] h-[80px] -right-14 -bottom-14 bg-white border-[#FF6262] p-3 rounded-full"
                >
                  <Image
                    src="/close-r.svg"
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
