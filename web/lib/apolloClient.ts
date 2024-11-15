import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

// アクセストークンを取得してHTTPヘッダーに追加
const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// HTTPリンクを設定
const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql',
})

// WebSocketリンクを設定
const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: 'ws://localhost:3001/graphql',
        }),
      )
    : null

// リンクを分割: HTTPかWebSocketかを判定
const splitLink =
  typeof window !== 'undefined' && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        wsLink,
        authLink.concat(httpLink), // HTTPリクエストにauthLinkを追加
      )
    : authLink.concat(httpLink)

// Apollo Clientを作成
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

export default client
