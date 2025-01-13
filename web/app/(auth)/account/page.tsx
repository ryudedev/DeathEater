'use client'

import Card from '@/components/card'
import Header from '@/components/header'
import Input from '@/components/input'
import Label from '@/components/label'
import MemberList from '@/components/memberlist'
import Image from 'next/image'
import { useState } from 'react'

export default function Account() {
  const members: {
    role: 'ADMIN' | 'LEADER' | 'MEMBER'
    name: string
  }[] = [
    { role: 'ADMIN', name: '豊田 真紀子' },
    { role: 'LEADER', name: '林 雅史' },
  ]
  const [myName] = useState('豊田 真紀子')

  // 自分の情報だけを取得
  const myProfile = members.filter((member) => member.name === myName)

  // アイコンをカスタマイズする
  const customRoleIcons = {
    ADMIN: '/user.svg',
    LEADER: '/user.svg',
    MEMBER: '/users.svg',
  }

  return (
    <>
      <Header showBackButton title="アカウント" />
      <MemberList
        members={myProfile.map((member) => ({
          ...member,
          icon: customRoleIcons[member.role], // カスタムアイコンを適用
        }))}
      />
      <div className="px-6">
        <Card gap={7} className="p-1 pb-[22px] items-center">
          <div className="w-full flex flex-col gap-1.5 p-3 pl-20">
            <Image
              src="/note.svg"
              alt="Note"
              width={50}
              height={50}
              className="absolute mb-6 top-0 left-0"
            />
            <Label htmlFor="name" className="pt-4">
              ユーザー名
              <Input
                type="text"
                placeholder="名前"
                onChange={() => {}}
                isError={null}
                disabled
              />
            </Label>
            <Label htmlFor="email" className="pt-4">
              メールアドレス
              <Input
                type="email"
                className="w-full"
                placeholder="makiko.toyoda@gmail.com"
                onChange={() => {}}
                isError={null}
                disabled
              />
            </Label>
            <a href="#" className="text-[#1E9A9A] text-xs px-3 pt-3">
              ＞メールアドレス変更
            </a>
          </div>
        </Card>
      </div>
    </>
  )
}
