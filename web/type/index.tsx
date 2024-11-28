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
}

export type Capsule = {
  id?: string
  class_id?: string
  size?: number
  release_date?: Date
  upload_deadline?: Date
  created_at?: Date
  updated_at?: Date
}

export type UserClassesWithoutCapsules = Omit<UserClasses, 'class'> & {
  class: Omit<Class, 'capsules'>
}
