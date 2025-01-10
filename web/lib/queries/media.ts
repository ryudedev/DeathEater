import { gql } from '@apollo/client'

export const UPLOAD_FILE = gql`
  mutation uploadFiles(
    $organization_id: String!
    $school_id: String!
    $class_id: String!
    $files: [String!]!
  ) {
    uploadFiles(
      organization_id: $organization_id
      school_id: $school_id
      class_id: $class_id
      files: $files
    )
  }
`

export const GET_FILES_IN_DIRECTORY = gql`
  query GetFilesInDirectory(
    $organization_id: String!
    $school_id: String!
    $class_id: String!
  ) {
    getFilesInDirectory(
      organization_id: $organization_id
      school_id: $school_id
      class_id: $class_id
    ) {
      key
      url
      type
      name
      size
      category
      uploadedAt
    }
  }
`
