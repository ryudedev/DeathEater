import { gql } from '@apollo/client'

// サインインミューテーション
export const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(authDto: { email: $email, password: $password }) {
      accessToken
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
