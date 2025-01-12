'use client'
import { UPLOAD_FILE } from '@/lib/queries/media'
import { useDashboardStore } from '@/store'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import Button from './button'
import Card from './card'
import ImageCheckbox from './galleryt'
import PlusIcon from './icon/plusIcon'
import Input from './input'
import Label from './label'

interface Photo {
  id: string
  fileData: File
  isDeletable: boolean
}

interface MediaAddProps {
  onClose: () => void
}

const MediaAdd: React.FC<MediaAddProps> = ({ onClose }) => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [fileError, setFileError] = useState<boolean | null>(null)
  const [uploadFiles] = useMutation(UPLOAD_FILE)
  const {
    user,
    capsules,
    selectedOrganizationId,
    selectedSchoolId,
    selectedClassId,
  } = useDashboardStore()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // imageUrlはbase64エンコードされたファイルのURL
      const newPhotos = Array.from(event.target.files).map((file, index) => ({
        id: `${photos.length + index + 1}`,
        fileData: file,
        isDeletable: false,
      }))
      setPhotos((prev) => [...prev, ...newPhotos])
      setFileError(null)
    } else {
      setFileError(true)
    }
  }

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, isDeletable: isChecked } : photo,
      ),
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const base64Files = await Promise.all(
        photos.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(file.fileData)
            }),
        ),
      )

      if (capsules !== null) {
        const response = await uploadFiles({
          variables: {
            organization_id: selectedOrganizationId,
            school_id: selectedSchoolId,
            class_id: selectedClassId,
            files: base64Files,
            uploaded_by: user?.id,
            capsule_id: capsules[capsules.length - 1].id,
          },
        })
        console.log(response)
      }
    } catch (error) {
      console.error(error)
      setFileError(true)
    }
  }

  return (
    <Card
      gap={7}
      className="p-1 pb-[22px] items-end bg-white shadow-md rounded-lg w-full max-w-4xl relative"
    >
      <button
        onClick={onClose}
        className="text-gray-600 hover:text-gray-800 absolute top-2 right-2"
      >
        <PlusIcon rotate={45} color="#363853" />
      </button>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 p-3 w-full">
          <Label htmlFor="file">
            メディア
            <Input
              id="file"
              name="file"
              placeholder="ファイル選択"
              type="file"
              accept="image/*, video/*, audio/*, text/*"
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

        {/* 写真一覧のコンテナ */}
        <div className="w-full overflow-hidden p-3">
          <div className="w-full overflow-x-auto">
            <div
              className={`flex gap-2 ${photos.length ? 'justify-start' : 'justify-center'}`}
              style={{
                minWidth: 'min-content',
                paddingBottom: '8px', // スクロールバー用の余白
              }}
            >
              {photos.length ? (
                photos.map((photo) => (
                  <div key={photo.id} className="flex-shrink-0">
                    <ImageCheckbox
                      imageUrl={URL.createObjectURL(photo.fileData)}
                      label=""
                      onChange={(isChecked) =>
                        handleCheckboxChange(photo.id, isChecked)
                      }
                      showCheckbox={true}
                      isChecked={photo.isDeletable}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  選択されたメディアはありません。
                </p>
              )}
            </div>
          </div>
        </div>

        <Button
          className="absolute px-5 py-2 w-[80px] h-[80px] flex items-start justify-start -right-6 -bottom-[27px] bg-[#441AFF] transition duration-300 font-semibold rounded-full text-white"
          type="submit"
        >
          <div className="-pl-2 mt-2">申請</div>
        </Button>
      </form>
    </Card>
  )
}

export default MediaAdd
