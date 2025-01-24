import { gql } from '@apollo/client'

export const UPLOAD_FILE = gql`
  mutation uploadFiles(
    $organization_id: String!
    $school_id: String!
    $class_id: String!
    $capsule_id: String!
    $uploaded_by: String!
    $deletable: [Boolean!]!
    $files: [String!]!
  ) {
    uploadFiles(
      organization_id: $organization_id
      school_id: $school_id
      class_id: $class_id
      capsule_id: $capsule_id
      uploaded_by: $uploaded_by
      deletable: $deletable
      files: $files
    )
  }
`

export const GET_FILES_IN_DIRECTORY = gql`
  query getFilesInDirectory(
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
      deletable
      category
      uploadedAt
    }
  }
`

export const DELETE_MEDIA = gql`
  mutation deleteMedia(
    $organization_id: String!
    $school_id: String!
    $class_id: String!
    $capsule_id: String!
    $key: String!
  ) {
    deleteMedia(
      organization_id: $organization_id
      school_id: $school_id
      class_id: $class_id
      capsule_id: $capsule_id
      key: $key
    ) {
      id
      file_path
      file_type
    }
  }
`
