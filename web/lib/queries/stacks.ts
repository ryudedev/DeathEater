import { gql } from '@apollo/client'

export const STACK_UPLOAD_FILE = gql`
  mutation stackUploadFiles(
    $organization_id: String!
    $school_id: String!
    $class_id: String!
    $capsule_id: String!
    $uploaded_by: String!
    $files: [String!]!
  ) {
    stackUploadFiles(
      organization_id: $organization_id
      school_id: $school_id
      class_id: $class_id
      capsule_id: $capsule_id
      uploaded_by: $uploaded_by
      files: $files
    )
  }
`

export const STACK_GET_FILES_IN_DIRECTORY = gql`
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
      uploaded_by
    }
  }
`
