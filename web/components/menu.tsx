// components/Menu.tsx
import Link from 'next/link'
import React from 'react'
import Card from './card'
import MenuItem from './menuitem'

const Menu: React.FC = () => {
  const menuItems = [
    {
      iconSrc: '/document.svg',
      title: 'ログ',
      arrowSrc: '/arrow-right-blue.svg',
      link: '/log',
    },
    {
      iconSrc: '/gallery.svg',
      title: 'メディア一覧',
      arrowSrc: '/arrow-right-blue.svg',
      link: '/media',
    },
    {
      iconSrc: '/two-user.svg',
      title: 'メンバー',
      arrowSrc: '/arrow-right-blue.svg',
      link: '/members',
    },
    {
      iconSrc: '/box.svg',
      title: '容量',
      arrowSrc: '/arrow-right-blue.svg',
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
