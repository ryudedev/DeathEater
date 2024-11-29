'use client'
import Card from '@/components/card'
import ImageCheckbox from '@/components/galleryt'
import Header from '@/components/header'
import React, { useState } from 'react'

const Media: React.FC = () => {
  // 写真データ（配列）
  const photoData = [
    { id: '1', imageUrl: 'https://via.placeholder.com/75', label: 'Image 1' },
    { id: '2', imageUrl: 'https://via.placeholder.com/75', label: 'Image 2' },
    { id: '3', imageUrl: 'https://via.placeholder.com/75', label: 'Image 3' },
    { id: '4', imageUrl: 'https://via.placeholder.com/75', label: 'Image 4' },
    { id: '5', imageUrl: 'https://via.placeholder.com/75', label: 'Image 5' },
  ]

  // 選択された写真の状態を管理
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])

  // チェックボックスの状態を管理
  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setSelectedPhotos((prev) =>
      isChecked ? [...prev, id] : prev.filter((photoId) => photoId !== id),
    )
    console.log(selectedPhotos)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="メディア一覧" showBackButton />
      <div className="pt-6 px-6">
        <Card
          gap={7}
          className="h-[704px] pt-[100px] flex flex-wrap items-center overflow-y-auto"
        >
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-1">
            {photoData.map((photo) => (
              <ImageCheckbox
                key={photo.id}
                imageUrl={photo.imageUrl}
                label={photo.label}
                onChange={(isChecked) =>
                  handleCheckboxChange(photo.id, isChecked)
                }
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Media
