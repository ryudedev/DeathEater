'use client'
import { get_cookie } from '@/lib/cookie'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [email, setEmail] = useState<string | null | undefined>(null)
  useEffect(() => {
    const fetchData = async () => {
      const email = await get_cookie('email')
      setEmail(email)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
      <p>{email}</p>
    </div>
  )
}
