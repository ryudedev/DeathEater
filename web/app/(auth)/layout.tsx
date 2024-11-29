'use client'
import { useDashboardStore } from '@/store'
import { useEffect } from 'react'

type LayoutProps = {
  children?: React.ReactNode
}

export default function AuthLayout({ children }: LayoutProps) {
  const { setInit } = useDashboardStore()
  useEffect(() => {
    setInit()
  }, [])
  return <div className="w-screen h-screen flex flex-col gap-2">{children}</div>
}
