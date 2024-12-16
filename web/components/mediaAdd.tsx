'use client'
import { useState } from 'react'
import Button from './button'
import Card from './card'
import ImageCheckbox from './galleryt'
import Input from './input'
import Label from './label'

interface Photo {
  id: string
  imageUrl: string
  isDeletable: boolean
}

const MediaAdd: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [fileError, setFileError] = useState<boolean | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files).map((file, index) => ({
        id: `${photos.length + index + 1}`, // 一意の ID を付与
        imageUrl: URL.createObjectURL(file),
        isDeletable: false, // 初期状態では削除不可
      }))
      setPhotos((prev) => [...prev, ...newPhotos])
      setFileError(null)
    } else {
      setFileError(true) // エラーが発生した場合
    }
  }

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, isDeletable: isChecked } : photo,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <Card
        gap={7}
        className="p-1 pb-[22px] items-center bg-white shadow-md rounded-lg w-full max-w-4xl"
      >
        {/* ファイルアップロード */}
        <div className="flex flex-col gap-2 p-3 w-full">
          <Label htmlFor="file">
            メディア
            <Input
              id="file"
              name="file"
              placeholder="ファイル選択"
              type="file"
              multiple
              className="w-full"
              onChange={handleFileChange}
              isError={fileError === false}
            />
          </Label>
          {fileError && (
            <p className="text-red-500 text-sm mt-2">
              ファイルのアップロードに失敗しました。再試行してください。
            </p>
          )}
          <div className="text-gray-600 text-sm">
            アップロード後、削除可能にするものにチェックを入れてください。
          </div>
        </div>

        {/* 横スライド可能な選択した写真一覧 */}
        <div className="flex overflow-x-auto gap-2 p-3">
          {photos.map((photo) => (
            <ImageCheckbox
              key={photo.id}
              imageUrl={photo.imageUrl}
              label="" // ラベルを非表示
              onChange={(isChecked) =>
                handleCheckboxChange(photo.id, isChecked)
              }
              showCheckbox={true} // チェックボックスを常に表示
              isChecked={photo.isDeletable}
            />
          ))}
        </div>
        <Button
          className="absolute px-5 py-2 w-[80px] h-[80px] flex items-start justify-start -right-6 -bottom-[27px] bg-[#441AFF] transition duration-300 font-semibold rounded-full text-white"
          type="submit"
        >
          <div className="-pl-2 mt-2">申請</div>
        </Button>
      </Card>
    </div>
  )
}

export default MediaAdd
