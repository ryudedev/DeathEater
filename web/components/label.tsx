// Label.tsx
type LabelProps = {
  children: React.ReactNode
  className?: string
  htmlFor: string
} & Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'className' | 'htmlFor'
>

export default function Label({
  children,
  className = '',
  htmlFor,
}: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-foreground ${className}`}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}
