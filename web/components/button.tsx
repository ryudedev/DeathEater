import React from 'react'

type PaddingEnum = 32 | 20 | 16 | 15 | 8 | 0
type Position = 'center' | 'start' | 'end'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemsPosition?: Position
  justifyPosition?: Position
  padding?: {
    top?: PaddingEnum
    bottom?: PaddingEnum
    left?: PaddingEnum
    right?: PaddingEnum
    x?: PaddingEnum
    y?: PaddingEnum
  }
}

const Button: React.FC<ButtonProps> = ({
  children,
  itemsPosition = 'center',
  justifyPosition = 'center',
  padding = {},
  className = '',
  ...props
}) => {
  const pad = (dir: keyof typeof padding) =>
    `p${dir.charAt(0)}-${padding[dir] ?? 0}`

  return (
    <button
      className={`flex items-${itemsPosition} justify-${justifyPosition} ${pad('x')} ${pad('y')} ${pad('top')} ${pad('right')} ${pad('bottom')} ${pad('left')} bg-primary border border-primary rounded-full ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
