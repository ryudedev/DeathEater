'use client'

type DashboardCardProps = {
  children: React.ReactNode
  className?: string
}

export default function DashboardCard({
  children,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-2xl border border-border flex flex-col gap-4 p-4 ${className}`}
    >
      {children}
    </div>
  )
}
