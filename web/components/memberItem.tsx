type MemberItemProps = {
  // onClick: () => void
  name: string
  role: string
}

export default function MemberItem({ name, role }: MemberItemProps) {
  return (
    <div className="flex flex-row items-center text-xs font-bold py-4">
      <p className="flex-1">{name}</p>
      <p className="flex-1">{role}</p>
    </div>
  )
}
