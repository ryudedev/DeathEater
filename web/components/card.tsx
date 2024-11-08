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
  const bgColorClass = bgColor === 'blue' ? 'bg-blue-100' : 'bg-white'

  // 各パディングを個別に適用
  const paddingClasses = [
    padding.x !== undefined ? `px-${padding.x}` : '',
    padding.y !== undefined ? `py-${padding.y}` : '',
    padding.top !== undefined ? `pt-${padding.top}` : '',
    padding.right !== undefined ? `pr-${padding.right}` : '',
    padding.bottom !== undefined ? `pb-${padding.bottom}` : '',
    padding.left !== undefined ? `pl-${padding.left}` : '',
  ].join(' ')

  return (
    <div
      className={`w-full flex ${flexDirection} ${gapClass} ${bgColorClass} rounded-2xl drop-shadow-default ${paddingClasses} overflow-hidden`}
      {...props}
    >
      {children}
    </div>
  )
}
