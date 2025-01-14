import { gql } from '@apollo/client'

export const CREATE_CAPSULE = gql`
  mutation CreateCapsule($createCapsuleInput: CreateCapsuleInput!) {
    createCapsule(createCapsuleInput: $createCapsuleInput) {
      id
    }
  }
`
