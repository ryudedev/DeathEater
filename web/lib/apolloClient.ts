import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

// HTTPリンクを設定
const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql', // NestJSのGraphQLエンドポイント
})

// WebSocketリンクを設定
const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: 'ws://localhost:3001/graphql', // WebSocketのエンドポイント
        }),
      )
    : null

// リンクを分割: クエリ/ミューテーションにはHTTP、サブスクリプションにはWebSocketを使用
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
        httpLink,
      )
    : httpLink

// Apollo Clientを作成
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

export default client
