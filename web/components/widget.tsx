import ChevronIcon from './chevronIcon'

interface WidgetBaseProps {
  title?: string
  children: React.ReactNode
  className?: string
}

interface WidgetWithChevronProps extends WidgetBaseProps {
  showChevron: true
  onLeftChevronClick: () => void // 左向きChevronのクリック時のコールバック
  onRightChevronClick: () => void // 右向きChevronのクリック時のコールバック
}

interface WidgetWithoutChevronProps extends WidgetBaseProps {
  showChevron?: false
  onLeftChevronClick?: never // 非表示の場合はコールバックを許容しない
  onRightChevronClick?: never
}

type WidgetProps = WidgetWithChevronProps | WidgetWithoutChevronProps

export default function Widget({
  title,
  children,
  className,
  showChevron = false,
  onLeftChevronClick,
  onRightChevronClick,
  ...props
}: WidgetProps) {
  return (
    <div
      className={`flex flex-col gap-4 h-full w-full rounded-2xl p-4 bg-white overflow-scroll ${className}`}
      {...props}
    >
      {/* ドラッグ可能ハンドル */}
      <div
        className={`flex flex-row ${showChevron ? 'justify-between' : 'justify-start'} items-center`}
      >
        <div className="flex flex-row gap-2.5 items-center">
          <div className="drag-handle p-2 grid grid-cols-2 gap-1 w-10 cursor-grabbing">
            {Array(6)
              .fill(null)
              .map((_, idx) => (
                <span
                  key={idx}
                  className="w-2 h-2 bg-foreground rounded-full inline-block"
                ></span>
              ))}
          </div>
          <h1 className="font-bold text-2xl">{title}</h1>
        </div>
        {showChevron && (
          <div className="flex flex-row gap-6">
            <div onClick={onLeftChevronClick} className="cursor-pointer">
              <ChevronIcon fill="#363853" rotate={180} />
            </div>
            <div onClick={onRightChevronClick} className="cursor-pointer">
              <ChevronIcon fill="#363853" rotate={0} />
            </div>
          </div>
        )}
      </div>

      {children}
    </div>
  )
}
