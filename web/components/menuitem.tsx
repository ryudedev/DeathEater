// components/MenuItem.tsx
import Image from 'next/image'
import React from 'react'

interface MenuItemProps {
  iconSrc: string
  title: string
  arrowSrc: string
}

const MenuItem: React.FC<MenuItemProps> = ({ iconSrc, title, arrowSrc }) => {
  return (
    <div className="p-2">
      <div className="w-full flex items-center justify-between">
        <Image
          src={iconSrc}
          alt={title}
          width={35}
          height={35}
          className="rounded-full object-cover px-2"
        />

        <span className="flex-1 text-sm">{title}</span>

        <Image src={arrowSrc} alt="arrow" width={24} height={24} />
      </div>
    </div>
  )
}

export default MenuItem
