import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

// アクセストークンを取得してHTTPヘッダーに追加
const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
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

// リンクを単純にHTTPのみに設定
const link = authLink.concat(httpLink)

// エラーハンドリングのリンク設定
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`,
      )
    })
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

// Apollo Clientを作成
const client = new ApolloClient({
  link: errorLink.concat(link), // errorLinkを先に追加
  cache: new InMemoryCache(),
})

export default client
