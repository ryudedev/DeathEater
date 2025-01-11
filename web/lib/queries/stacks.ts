import { gql } from '@apollo/client'

export const STACK_UPLOAD_FILE = gql`
  mutation UploadFiles(
    $organizationId: String!
    $schoolId: String!
    $classId: String!
    $files: [String!]!
  ) {
    uploadFiles(
      organization_id: $organizationId
      school_id: $schoolId
      class_id: $classId
      files: $files
    )
  }
`
