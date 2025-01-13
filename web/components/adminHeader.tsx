'use client'
import { useDashboardStore } from '@/store'
import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function AdminHeader() {
  const [selectedClassName, setSelectedClassName] = useState<string>('')
  const [searchWord, setSearchWord] = useState<string>('')
  const {
    capsules,
    classList,
    setClassMembers,
    setSelectedClassId,
    setMediaList,
  } = useDashboardStore()

  useEffect(() => {
    if (classList && classList.length > 0) {
      const firstClass = classList[0]
      if (firstClass && firstClass.id && firstClass.name) {
        setSelectedClassId(firstClass.id)
        setSelectedClassName(firstClass.name)
        setClassMembers(firstClass.id)
        if (firstClass.school?.organization_id && firstClass.school_id) {
          const capsule_size = capsules?.find((capsule) => {
            return capsule.class_id === firstClass.id
          })?.size
          if (!capsule_size) return
          setMediaList(
            firstClass.school.organization_id,
            firstClass.school_id,
            firstClass.id,
            capsules[0].id!,
          )
        }
      }
    }
  }, [classList, setClassMembers, setMediaList, setSelectedClassId])

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const handleDialogToggle = () => {
    if (isDialogOpen) {
      setIsMounted(false)
      setTimeout(() => setIsDialogOpen(false), 300)
    } else {
      setIsDialogOpen(true)
      setTimeout(() => setIsMounted(true), 10)
    }
  }

  const selectedHandler = ({
    className,
    id,
  }: {
    className: string
    id: string
  }) => {
    setSelectedClassName(className)
    setSelectedClassId(id)
    handleDialogToggle()
  }

  return (
    <div className="w-full flex flex-row justify-between px-5 py-[15px] bg-primary">
      <Image src="/admin-reminico.svg" alt="logo" width={89} height={30} />
      <div className="flex gap-4 items-center relative">
        <div
          className="group text-white border border-white bg-primary rounded-lg flex gap-2.5 px-4 py-2 hover:bg-white hover:text-primary duration-300 font-bold items-center hover:cursor-pointer"
          onClick={handleDialogToggle}
        >
          <p>{selectedClassName}</p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white group-hover:text-primary transition-colors duration-200"
          >
            <path
              d="M17 9.5L12 14.5L7 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {isDialogOpen && (
          <div
            className={clsx(
              'fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50',
              isMounted
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-90 translate-y-4',
            )}
          >
            <div
              className={clsx(
                'transform rounded-lg shadow-lg p-6 bg-white flex flex-col gap-6 transition-all duration-300',
                isMounted
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-90 translate-y-4',
              )}
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">クラスを選択</h2>
                <p className="text-description font-bold">
                  カプセルを選択してください。カプセルが見つけにくい場合は、検索してください。
                </p>
              </div>
              <div className="flex flex-row">
                <Image src="/search.svg" alt="検索" width={24} height={24} />
                <input
                  type="text"
                  className="focus:outline-none focus:ring-0 rounded px-4 py-2"
                  onChange={(e) => setSearchWord(e.target.value)}
                  value={searchWord}
                />
              </div>
              <ul className="flex flex-col py-2">
                {classList
                  ?.filter((classItem) => classItem?.name?.includes(searchWord))
                  .map((classItem, index) => (
                    <li
                      key={classItem?.id || index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if (classItem?.name && classItem?.id) {
                          selectedHandler({
                            className: classItem.name,
                            id: classItem.id,
                          })
                        }
                      }}
                    >
                      {classItem?.name}
                    </li>
                  ))}
              </ul>
              <button
                className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                onClick={() => setIsDialogOpen(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
