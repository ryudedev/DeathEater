type MemberProps = {
  role: '管理者' | 'サブリーダー' | 'メンバー'
  name: string
}

export default function Member({ role, name }: MemberProps) {
  return (
    <div className="p-2 flex flex-col">
      <div className="text-[#BFBFBF] text-xs">{role}</div>
      <div className="font-medium">{name}</div>
    </div>
  )
}

// const members: {
//   role: '管理者' | 'サブリーダー' | 'メンバー'
//   name: string
// }[] = [
//   { role: '管理者', name: '豊田 真紀子' },
//   { role: 'サブリーダー', name: '林 雅史' },
//   { role: 'サブリーダー', name: '吉田 千恵子' },
//   { role: 'メンバー', name: '佐藤 一郎' },
//   { role: 'メンバー', name: '山田 花子' },
//   { role: 'メンバー', name: '鈴木 太郎' },
//   { role: 'メンバー', name: '田中 美咲' },
//   { role: 'メンバー', name: '高橋 健太' },
//   { role: 'メンバー', name: '伊藤 結衣' },
//   { role: 'メンバー', name: '小林 陽介' },
//   { role: 'メンバー', name: '加藤 真由' },
// ]
