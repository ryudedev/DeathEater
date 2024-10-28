'use client'
import { CREATE_USER, GET_USERS } from '@/lib/operation'
import { useMutation } from '@apollo/client'
import { useState } from 'react'

export default function CreateUser() {
  const [email, setEmail] = useState('')
  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    update(cache, { data: { createUser } }) {
      // GET_USERSクエリのキャッシュを取得
      const { users } = cache.readQuery({ query: GET_USERS })

      // 新しいユーザーを追加してキャッシュを書き換え
      cache.writeQuery({
        query: GET_USERS,
        data: { users: [...users, createUser] },
      })
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUser({ variables: { email } })
      setEmail('')
    } catch (err) {
      console.error('Error creating user:', err)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
