export type User = {
  id: string
  cognito_id: string
  email: string
  lastName: string
  firstName: string
  role: string
  avatar?: string
  created_at: Date
  updated_at: Date
}
