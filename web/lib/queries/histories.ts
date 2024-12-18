import { gql } from '@apollo/client'

export const GET_HISTORY = gql`
  query findByCapsuleId($capsule_id: String!) {
    findByCapsuleId(capsule_id: $capsule_id) {
      id
      capsule_id
      event
      user_id
      history_id
      created_at
      user {
        id
        role
      }
    }
  }
`

export const GET_MEMBER = gql`
  query getMemberList($class_id: String!) {
    getMemberList(class_id: $class_id) {
      role
      name
    }
  }
`
