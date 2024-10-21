import { gql } from '@apollo/client'

// 全ユーザー取得クエリ
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
    }
  }
`

// 新しいユーザー作成ミューテーション
export const CREATE_USER = gql`
  mutation CreateUser($email: String!) {
    createUser(email: $email) {
      id
      email
    }
  }
`

// 新しいユーザーが追加された際のサブスクリプション
export const USER_ADDED_SUBSCRIPTION = gql`
  subscription UserAdded {
    userAdded {
      id
      email
    }
  }
`
