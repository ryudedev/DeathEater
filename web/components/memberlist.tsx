import Image from 'next/image'
import Card from './card'
import Member from './member'

type MemberItem = {
  role: '管理者' | 'サブリーダー' | 'メンバー'
  name: string
}

type MemberListProps = {
  members: MemberItem[]
}

function RoleIcon({ role }: { role: MemberItem['role'] }) {
  const roleToSrc = {
    管理者: '/leader.svg',
    サブリーダー: '/subleader.svg',
    メンバー: '/member.svg',
  }
  return <Image src={roleToSrc[role]} alt={role} width={50} height={50} />
}
const roleToPhoto: Record<MemberItem['role'], JSX.Element> = {
  管理者: <RoleIcon role="管理者" />,
  サブリーダー: <RoleIcon role="サブリーダー" />,
  メンバー: <RoleIcon role="メンバー" />,
}

export default function MemberList({ members }: MemberListProps) {
  const groupedMembers = members.reduce<
    Record<MemberItem['role'], MemberItem[]>
  >(
    (acc: Record<MemberItem['role'], MemberItem[]>, member) => {
      if (!acc[member.role]) {
        acc[member.role] = []
      }
      acc[member.role].push(member)
      return acc
    },
    { 管理者: [], サブリーダー: [], メンバー: [] },
  )

  return (
    <div className="p-4 space-y-6">
      {Object.entries(groupedMembers).map(([role, roleMembers]) => (
        <Card key={role} className="relative pb-6">
          <div className="absolute top-0 left-0">
            {roleToPhoto[role as MemberItem['role']]}
          </div>
          <div className="flex flex-col items-center justify-center pt-6 pr-20">
            {roleMembers.map((member) => (
              <Member
                key={`${member.role}-${member.name}`} // 修正: 一意のキーを生成
                role={member.role}
                name={member.name}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
