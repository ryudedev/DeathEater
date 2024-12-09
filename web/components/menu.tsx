// components/Menu.tsx
import Link from 'next/link'
import React from 'react'
import Card from './card'
import MenuItem from './menuitem'

const Menu: React.FC = () => {
  const menuItems = [
    {
      iconSrc: '/images/document.svg',
      title: 'ログ',
      arrowSrc: '/images/arrow-right-blue.svg',
      link: '/log',
    },
    {
      iconSrc: '/images/gallery.svg',
      title: 'メディア一覧',
      arrowSrc: '/images/arrow-right-blue.svg',
      link: '/media',
    },
    {
      iconSrc: '/images/two-user.svg',
      title: 'メンバー',
      arrowSrc: '/images/arrow-right-blue.svg',
      link: '/members',
    },
    {
      iconSrc: '/images/box.svg',
      title: '容量',
      arrowSrc: '/images/arrow-right-blue.svg',
      link: '/storage',
    },
  ]

  return (
    <Card flexDir="column" gap={3} bgColor="white" className="px-1 py-1.5">
      {menuItems.map((item, index) => (
        <div key={`menu-item-${index}`}>
          <Link href={item.link} className="text-xs text-[#363853]">
            <MenuItem
              iconSrc={item.iconSrc}
              title={item.title}
              arrowSrc={item.arrowSrc}
            />
          </Link>
          {index < menuItems.length - 1 && (
            <hr className="border-gray-200 mx-6" />
          )}
        </div>
      ))}
    </Card>
  )
}

export default Menu
