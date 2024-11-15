import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  flexDir?: 'row' | 'column'
  gap?: number
  bgColor?: 'blue' | 'white'
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
    x?: number
    y?: number
  }
}

export default function Card({
  children,
  flexDir,
  gap,
  bgColor,
  padding = {},
  ...props
}: CardProps) {
  const flexDirection = flexDir === 'row' ? 'flex-row' : 'flex-col'
  const gapClass = gap ? `gap-${gap}` : 'gap-4'
  const bgColorClass = bgColor === 'blue' ? 'bg-[#441AFF]' : 'bg-white'

  // 各パディングを個別に適用
  const pad = (dir: keyof typeof padding) =>
    `p${dir.charAt(0)}-${padding[dir] ?? 0}`

  return (
    <div
      className={`w-full flex ${flexDirection} ${gapClass} ${bgColorClass} rounded-2xl drop-shadow-default ${pad('x')} ${pad('y')} ${pad('top')} ${pad('right')} ${pad('bottom')} ${pad('left')} overflow-hidden`}
      {...props}
    >
      {children}
    </div>
  )
}
