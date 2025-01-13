import Image from 'next/image'
import Card from './card'
import Member from './member'

type MemberItem = {
  role: 'ADMIN' | 'LEADER' | 'MEMBER'
  name: string
  icon?: string // アイコンを渡すプロパティを追加
}

type MemberListProps = {
  members: MemberItem[]
}

function RoleIcon({ icon }: { icon: string }) {
  return <Image src={icon} alt="Role Icon" width={50} height={50} />
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <div className="p-6">
      {members.map((member) => (
        <Card key={`${member.role}-${member.name}`} className="relative pb-6">
          <div className="absolute top-0 left-0">
            {/* カスタムアイコンを表示 */}
            {member.icon && <RoleIcon icon={member.icon} />}
          </div>
          <div className="flex flex-col items-center justify-center pt-6 pr-20">
            <Member role={member.role} name={member.name} />
          </div>
        </Card>
      ))}
    </div>
  )
}
