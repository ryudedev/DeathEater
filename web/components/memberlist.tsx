import Image from 'next/image'
import Card from './card'
import Member from './member'

type MemberItem = {
  role: 'ADMIN' | 'LEADER' | 'MEMBER'
  name: string
}

type MemberListProps = {
  members: MemberItem[]
}

function RoleIcon({ role }: { role: MemberItem['role'] }) {
  const roleToSrc = {
    ADMIN: '/images/leader.svg',
    LEADER: '/images/subleader.svg',
    MEMBER: '/images/member.svg',
  }
  return <Image src={roleToSrc[role]} alt={role} width={50} height={50} />
}
const roleToPhoto: Record<MemberItem['role'], JSX.Element> = {
  ADMIN: <RoleIcon role="ADMIN" />,
  LEADER: <RoleIcon role="LEADER" />,
  MEMBER: <RoleIcon role="MEMBER" />,
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
    { ADMIN: [], LEADER: [], MEMBER: [] },
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
