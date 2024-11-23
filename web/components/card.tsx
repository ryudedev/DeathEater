import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  flexDir?: 'row' | 'column'
  gap?: number
  bgColor?: 'blue' | 'white'
  className?: string
}

export default function Card({
  children,
  flexDir,
  gap,
  bgColor,
  className,
  ...props
}: CardProps) {
  const flexDirection = flexDir === 'row' ? 'flex-row' : 'flex-col'
  const gapClass = gap ? `gap-${gap}` : 'gap-4'
  const bgColorClass = bgColor === 'blue' ? 'bg-[#441AFF]' : 'bg-white'

  return (
    <div
      className={`w-full flex ${flexDirection} ${gapClass} ${bgColorClass} rounded-2xl drop-shadow-default overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
