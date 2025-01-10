// components/UploadForm.tsx
// import { useState } from "react";
import Button from '@/components/button'
import Trash from '@/components/icon/Trash'
import Image from 'next/image'

type UploadFormProps = {
  selectedFiles: File[]
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadForm: React.FC<UploadFormProps> = ({
  selectedFiles,
  setSelectedFiles,
  handleSubmit,
  handleFileChange,
}) => {
  const handleFileRemove = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    document.getElementById('file-input')?.click()
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="min-w-96 min-h-96 transform rounded-lg shadow-lg p-6 bg-white flex flex-col gap-6 transition-all duration-300">
        <form
          className="max-h-96 w-full flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-row gap-4 items-center">
            <button
              onClick={handleButtonClick}
              className="text-description px-4 py-2 rounded hover:bg-hover"
            >
              ファイルを選択
            </button>
            <p className="font-bold">{selectedFiles.length}ファイル選択中</p>
          </div>

          {/* 非表示のファイル入力 */}
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto overflow-x-visible px-8 py-4">
            {selectedFiles.map((file, index) => (
              <div
                key={file.name}
                className="flex flex-row gap-2 items-center justify-between rounded bg-white p-2"
              >
                <div className="flex flex-row gap-4 items-center">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-fit rounded"
                  />
                  <p className="font-bold">{file.name}</p>
                </div>
                <p>{file.type}</p>
                {/* ファイル削除ボタン */}
                <div onClick={() => handleFileRemove(index)}>
                  <Trash color="#441aff" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              disabled={selectedFiles.length === 0}
              type="submit"
              className="px-4 py-2 rounded-lg text-white disabled:opacity-30"
            >
              アップロード
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadForm
