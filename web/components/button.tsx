type PaddingEnum = 32 | 20 | 16 | 15 | 8 | 0

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  itemsPosition?: 'center' | 'start' | 'end'
  justifyPosition?: 'center' | 'start' | 'end'
  paddingTopSize?: PaddingEnum
  paddingBottomSize?: PaddingEnum
  paddingLeftSize?: PaddingEnum
  paddingRightSize?: PaddingEnum
  paddingXSize?: PaddingEnum
  paddingYSize?: PaddingEnum
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className,
  itemsPosition = 'center',
  justifyPosition = 'center',
  paddingTopSize = 0,
  paddingBottomSize = 0,
  paddingLeftSize = 0,
  paddingRightSize = 0,
  paddingXSize = 0,
  paddingYSize = 0,
}: ButtonProps) {
  const padding = {
    32: '32',
    20: '20',
    16: '16',
    15: '15',
    8: '8',
    0: '0',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-${itemsPosition} justify-${justifyPosition} px-${padding[paddingXSize]} py-${padding[paddingYSize]} pt-${padding[paddingTopSize]} pr-${padding[paddingRightSize]} pb-${padding[paddingBottomSize]} pl-${padding[paddingLeftSize]} bg-primary border border-primary rounded-full ${className}`}
    >
      {children}
    </button>
  )
}
