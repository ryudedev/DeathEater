export type User = {
  id?: string
  cognito_id?: string
  email?: string
  lastName?: string
  firstName?: string
  role?: string
  avatar?: string
  created_at?: Date
  updated_at?: Date
  userClasses?: UserClasses[]
}

export type UserClasses = {
  id?: string
  user_id?: string
  class_id?: string
  created_at?: Date
  updated_at?: Date
  class: Class
}

export type Class = {
  id?: string
  name?: string
  school_id?: string
  created_at?: Date
  updated_at?: Date
  capsules?: Capsule[]
  school?: School
}

export type School = {
  id?: string
  name?: string
  organization_id?: string
  school_type?: string
  address: string
  created_at?: Date
  updated_at?: Date
}

export type Capsule = {
  id?: string
  name?: string
  class_id?: string
  size?: 'small' | 'medium' | 'large'
  release_date?: Date
  upload_deadline?: Date
  url: string
  created_at?: Date
  updated_at?: Date
}

export type UsageProps = {
  [category: string]: number
}

export type UserClassesWithoutCapsules = Omit<UserClasses, 'class'> & {
  class: Omit<Class, 'capsules'>
}

export type UserClassesWithClass = UserClasses & {
  class: Class & {
    capsules?: Capsule[]
  }
}

export type Roles = 'ADMIN' | 'LEADER' | 'MEMBER'

export type MemberItem = {
  role: Roles
  name: string
}

export type MediaFile = {
  key: string
  url: string
  type: string
  name: string
  size: number
  category: string
  deletable: boolean
  uploadedAt: string
}

export type MediaDataProps = {
  label: string
  value: number
  color: string
}

export type StackProps = {
  key: string
  url: string
  type: string
  name: string
  size: number
  category: string
  uploaded_by: string
  user_id: string
  uploadedAt: string
}

export type MediaTypeProps = {
  id?: number
  name: string
  type: string
  filePath: string
  deletable: boolean
  uploadedAt: string
  category?: string
}

export interface GetFilesInDirectoryResponse {
  getFilesInDirectory: MediaFile[]
}
