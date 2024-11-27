import { gql } from '@apollo/client'

export const GET_USER = gql`
  query findUserByEmail($email: String!) {
    findUserByEmail(email: $email) {
      id
      cognito_id
      email
      lastName
      firstName
      role
      created_at
      updated_at
      userClasses {
        id
        user_id
        class_id
        created_at
        updated_at
        class {
          id
          name
          school_id
          created_at
          updated_at
        }
      }
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`
