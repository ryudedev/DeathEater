'use client'
import client from '@/lib/apolloClient'
import { GET_USERS, USER_ADDED_SUBSCRIPTION } from '@/lib/operation'
import { ApolloProvider, useQuery, useSubscription } from '@apollo/client'
import CreateUser from './components/user/create'

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <Content />
    </ApolloProvider>
  )
}

function Content() {
  const { loading, error, data } = useQuery(GET_USERS)
  const { error: subscriptionError } = useSubscription(USER_ADDED_SUBSCRIPTION)

  if (subscriptionError) {
    console.error('Subscription Error:', subscriptionError)
    return <p>Error: {subscriptionError.message}</p>
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <h1>Users</h1>
      <CreateUser />
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                id
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={user.id}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.id}
                </th>
                <td className="px-6 py-4">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
