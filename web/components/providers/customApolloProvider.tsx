'use client'
import client from '@/lib/apolloClient'
import { ApolloProvider } from '@apollo/client'

type CustomApolloProviderProps = {
  children: React.ReactNode
}

const CustomApolloProvider = ({ children }: CustomApolloProviderProps) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default CustomApolloProvider
