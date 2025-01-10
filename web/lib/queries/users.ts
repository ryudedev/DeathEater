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
            class_id
            release_date
            upload_deadline
          }
          school {
            organization_id
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

export const GET_ROLE = gql`
  query findUserByEmail($email: String!) {
    findUserByEmail(email: $email) {
      role
    }
  }
`
