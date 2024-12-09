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
      userClasses {
        id
        user_id
        class_id
        class {
          id
          name
          school_id
          capsules {
            id
            name
            size
            release_date
            url
            upload_deadline
          }
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
