import React from 'react'

interface PlusIconProps {
  size?: number // アイコンのサイズ
  color?: string // ストロークの色
  strokeWidth?: number // ストローク幅
  rotate?: number // 回転角度 (度)
  className?: string // カスタムクラス
}

const PlusIcon: React.FC<PlusIconProps> = ({
  size = 24,
  color = 'white',
  strokeWidth = 1.5,
  rotate = 0,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M8 12H16M12 8L12 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default PlusIcon
