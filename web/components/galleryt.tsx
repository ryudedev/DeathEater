import React from 'react'

interface Gallery {
  imageUrl: string
  label: string
  onChange: (isChecked: boolean) => void
  showCheckbox: boolean // チェックボックスの表示/非表示
  isChecked: boolean // チェックボックスの状態（親から管理）
}

const ImageCheckbox: React.FC<Gallery> = ({
  imageUrl,
  label,
  onChange,
  showCheckbox,
  isChecked,
}) => {
  const handleClick = () => {
    const newChecked = !isChecked
    onChange(newChecked)
  }

  return (
    <div
      className="relative w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all"
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt={label}
        className="w-full h-full object-cover"
        width={75}
        height={75}
      />
      {/* 条件に基づいてチェックボックスを表示 */}
      {showCheckbox && (
        <div
          className={`absolute -top-6 -left-6 w-12 h-12 rounded-full border-2 ${
            isChecked
              ? 'bg-[#441AFF] border-[#441AFF]'
              : 'bg-white border-[#441AFF]'
          } transition-all`}
        />
      )}
    </div>
  )
}

export default ImageCheckbox
