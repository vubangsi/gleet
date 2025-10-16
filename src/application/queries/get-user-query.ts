export interface GetUserQuery {
  userId?: string
  email?: string
}

export interface UserDto {
  id: string
  name: string
  email: string
  phone?: string
  isVerified: boolean
  githubUsername?: string
  createdAt: Date
  updatedAt: Date
}
