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

const roleToPhoto: Record<MemberItem['role'], JSX.Element> = {
  管理者: <Image src="/leader.svg" alt="管理者" width={50} height={50} />,
  サブリーダー: (
    <Image src="/subleader.svg" alt="サブリーダー" width={50} height={50} />
  ),
  メンバー: <Image src="/member.svg" alt="メンバー" width={50} height={50} />,
}

export default function MemberList({ members }: MemberListProps) {
  const groupedMembers = members.reduce(
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
            {roleMembers.map((member, idx) => (
              <Member key={idx} role={member.role} name={member.name} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
