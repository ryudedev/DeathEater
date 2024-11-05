// components/Header.tsx
'use client' // クライアントコンポーネントであることを宣言

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type HeaderProps = {
  title: string // 中央のタイトル
  iconSrc?: string // 右側のアイコンの画像パス (省略可能)
  showBackButton?: boolean // 戻るボタンを表示するかどうか
}

const Header: React.FC<HeaderProps> = ({
  title,
  iconSrc,
  showBackButton = true,
}) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false) // メニュー表示状態

  // 戻るボタンのハンドラー
  const handleBackClick = () => {
    router.back()
  }

  // アイコンクリックでメニューの表示を切り替える
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="relative flex items-center justify-between w-full h-[54px] bg-white p-2 rounded-lg">
      {/* 左側の戻るボタン (条件付き表示) */}
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
        <div className="w-6" /> // 戻るボタンがないときにスペースを確保
      )}

      {/* 中央のタイトル */}
      <h1 className="text-[20px] font-semibold text-gray-800">{title}</h1>

      {/* 右側のアイコン画像 (条件付き表示) */}
      {iconSrc ? (
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
            onClick={toggleMenu}
          >
            <Image src="/icon.svg" alt="User Icon" width={40} height={40} />
          </div>

          {/* メニュー (アイコンクリックで表示) */}
          {isMenuOpen && (
            <div
              className="absolute top-12 right-0 w-48 p-4 bg-white rounded-lg drop-shadow-default z-10 transform transition-transform duration-3000 ease-out"
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
              }}
            >
              <p className="text-lg font-semibold mb-2">ユーザー名</p>
              <p className="text-sm text-gray-500 mb-4">user@example.com</p>

              <hr className="border-gray-200 my-2" />

              <button className="w-full py-2 text-center hover:bg-gray-100 text-gray-800 font-medium rounded-md mb-2">
                アカウント
              </button>
              <button className="w-full py-2 text-center hover:bg-gray-100 text-gray-800 font-medium rounded-md mb-2">
                メールアドレス変更
              </button>

              {/* ログアウトボタン */}
              <button className="w-full py-2 px-4 text-center text-[#FF3B3B] hover:bg-[#FFE8E8] font-medium rounded-md">
                ログアウト
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-10 h-10" /> // アイコンがないときにスペースを確保
      )}
    </header>
  )
}

export default Header
