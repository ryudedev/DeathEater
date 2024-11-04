'use client'
import Input from '@/components/input'
import client from '@/lib/apolloClient'
import { ApolloProvider } from '@apollo/client'

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <Content />
    </ApolloProvider>
  )
}

function Content() {
  const textClickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  return (
    <>
      <Input type="text" onChange={textClickHandler} />
    </>
  )
}
