import { gql } from '@apollo/client'

export const UPLOAD_FILE = gql`
  mutation stackUploadFiles(
    $organization_id: String!
    $school_id: String!
    $class_id: String!
    $capsule_id: String!
    $files: [String!]!
  ) {
    stackUploadFiles(
      organization_id: $organization_id
      school_id: $school_id
      class_id: $class_id
      capsule_id: $capsule_id
      files: $files
    )
  }
`

export const GET_FILES_IN_DIRECTORY = gql`
  query stackGetFilesInDirectory(
    $organization_id: String!
    $school_id: String!
    $class_id: String!
  ) {
    stackGetFilesInDirectory(
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
