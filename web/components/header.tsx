// components/Header.tsx
'use client'

import { User } from '@/type'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

type HeaderProps = {
  title: string
  showBackButton?: boolean
  user?: User
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  user,
}) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleBackClick = () => {
    router.back()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // メニューが開いていて、かつクリックがメニュー外だった場合に閉じる
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className="relative flex items-center justify-between w-full h-[54px] bg-white p-2 rounded-lg">
      {showBackButton ? (
        <Image
          src="/arrow.svg"
          alt="Back Arrow"
          onClick={handleBackClick}
          width={24}
          height={24}
          className="cursor-pointer"
        />
      ) : (
        <div className="w-6" />
      )}

      <h1 className="text-[20px] font-semibold text-gray-800">{title}</h1>

      {user ? (
        <div className="relative" ref={menuRef}>
          <div
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border border-primary"
            onClick={toggleMenu}
          >
            <Image
              src={user.avatar || '/default-user.svg'}
              alt="User Icon"
              width={40}
              height={40}
            />
          </div>

          {isMenuOpen && (
            <div
              className="absolute top-12 right-0 w-48 p-4 bg-white rounded-lg drop-shadow-default z-10"
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
              }}
            >
              <p className="text-sm text-gray-500 mb-4">{user.role}</p>
              <p className="text-lg font-semibold mb-2">{user.name}</p>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>

              <hr className="border-gray-200 my-2" />

              <button className="w-full py-2 text-center hover:bg-gray-100 text-gray-800 font-medium rounded-md mb-2">
                アカウント
              </button>
              <button className="w-full py-2 text-center hover:bg-gray-100 text-gray-800 font-medium rounded-md mb-2">
                メールアドレス変更
              </button>

              <button className="w-full py-2 px-4 text-center text-[#FF3B3B] hover:bg-[#FFE8E8] font-medium rounded-md">
                ログアウト
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-10 h-10" />
      )}
    </header>
  )
}

export default Header
