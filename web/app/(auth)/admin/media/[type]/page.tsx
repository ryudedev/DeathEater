'use client'
import AdminHeader from '@/components/adminHeader'
import Button from '@/components/button'
import ChevronIcon from '@/components/chevronIcon'
import PlusIcon from '@/components/icon/plusIcon'
import MediaItemRow from '@/components/mediaItemRow'
import UploadForm from '@/components/UploadForm/ImageUploadForm' // UploadFormコンポーネントのインポート
import UsageAlert from '@/components/usageAlert'
import { UPLOAD_FILE } from '@/lib/queries/media'
import { useDashboardStore } from '@/store'
import { MediaFile } from '@/type'
import { useMutation } from '@apollo/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type TypeProps = {
  params: {
    type: string
  }
}

export default function Type({ params: { type } }: TypeProps) {
  const [mediaType, setMediaType] = useState<string>('')
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const router = useRouter()
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false)
  const [isCheck, setIsCheck] = useState<boolean[]>([])
  const {
    user,
    capsules,
    selectedOrganizationId,
    selectedSchoolId,
    selectedClassId,
    mediaList,
  } = useDashboardStore()
  const [uploadFile] = useMutation(UPLOAD_FILE)

  useEffect(() => {
    switch (type) {
      case 'images':
        setMediaType('画像')
        break
      case 'movies':
        setMediaType('動画')
        break
      case 'voices':
        setMediaType('音声')
        break
      case 'texts':
        setMediaType('テキスト')
        break
    }
  }, [type])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const base64Files = await Promise.all(
        selectedFiles.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(file)
            }),
        ),
      )

      if (
        capsules?.length &&
        base64Files.length &&
        selectedOrganizationId &&
        selectedSchoolId &&
        selectedClassId &&
        user?.id &&
        isCheck.length
      ) {
        await uploadFile({
          variables: {
            files: base64Files,
            organization_id: selectedOrganizationId,
            school_id: selectedSchoolId,
            class_id: selectedClassId,
            capsule_id: capsules[capsules.length - 1].id,
            uploaded_by: user.id,
            deletable: isCheck,
          },
        })
      }

      setShowUploadDialog(false)
      setSelectedFiles([])
      setAlertMessage('アップロードが成功しました！')
      setIsAlertVisible(true)

      setTimeout(() => {
        setIsAlertVisible(false)
        setTimeout(() => {
          setAlertMessage(null)
        }, 300)
      }, 3000)
    } catch (error) {
      console.error(error)
      alert('Upload failed.')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const filesArray = Array.from(event.target.files)
    setSelectedFiles(filesArray)
    setIsCheck(filesArray.map(() => false))
  }

  return (
    <div className="h-screen flex flex-col">
      <AdminHeader />
      <div className="h-full py-9 px-14 flex flex-col gap-6 overflow-hidden">
        {alertMessage && (
          <div
            className={`fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow transition-transform duration-300 ${isAlertVisible ? 'translate-x-0' : 'translate-x-full'}`}
            style={{
              transform: isAlertVisible ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            {alertMessage}
          </div>
        )}
        <UsageAlert totalUsage={90} />
        <div
          className="flex flex-row gap-2.5 cursor-pointer"
          onClick={() => router.back()}
        >
          <ChevronIcon rotate={180} fill="#363853" />
          <p className="text-2xl font-bold">{mediaType}</p>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex flex-col">
              <p className="font-bold text-description">合計</p>
              <p className="font-bold text-description">使用量</p>
            </div>
            <div>
              <Button
                className="text-white p-4 rounded-xl font-bold"
                onClick={() => setShowUploadDialog(true)}
              >
                画像をアップロード
              </Button>
            </div>
          </div>

          <div className="flex-2 p-4">
            <div className="flex flex-col gap-6 h-full overflow-hidden">
              <div className="flex flex-row items-center gap-4 font-bold text-description">
                <p className="flex-1">ファイル名</p>
                <p className="flex-1">タイプ</p>
                <p className="flex-1">アップロード日</p>
                <p className="flex-1">削除</p>
              </div>
              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-300px)]">
                {mediaList.length > 0 &&
                  mediaList
                    .filter((data) => data.category === mediaType)
                    .map((data) => (
                      <MediaItemRow
                        name={data.name}
                        type={data.type}
                        uploadedAt={data.uploadedAt}
                        filePath={data.key}
                        deletable={data.deletable}
                        key={data.key}
                        onClick={() => setSelectedMedia(data)}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="transform rounded-lg shadow-lg p-6 bg-white flex flex-col gap-6 transition-all duration-300">
            <div
              className="w-full flex justify-end"
              onClick={() => setSelectedMedia(null)}
            >
              <PlusIcon rotate={45} color="#363853" />
            </div>
            <div className="flex flex-col gap-2.5 font-bold">
              <p className="text-description">{selectedMedia.uploadedAt}</p>
              <div className="flex flex-row gap-2 items-end">
                <p className="text-2xl">{selectedMedia.name}</p>
                <p className="text-primary">{selectedMedia.type}</p>
              </div>
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.name}
                width={600}
                height={600}
                className="w-[600px] h-[600px] object-contain"
                unoptimized={selectedMedia.type === 'svg'}
              />
            </div>
          </div>
        </div>
      )}

      {showUploadDialog && (
        <UploadForm
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          isCheck={isCheck}
          handleCheck={(index) => {
            const newIsCheck = [...isCheck]
            newIsCheck[index] = !newIsCheck[index]
            setIsCheck(newIsCheck)
          }}
        />
      )}
    </div>
  )
}
