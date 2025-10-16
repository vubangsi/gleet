import { GetUserQuery, UserDto } from '../queries/get-user-query'
import { IUserRepository } from '@/infrastructure/repositories/user-repository'

export class GetUserHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(query: GetUserQuery): Promise<UserDto | null> {
    let user = null

    if (query.userId) {
      user = await this.userRepository.findById(query.userId)
    } else if (query.email) {
      user = await this.userRepository.findByEmail(query.email)
    }

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      phone: user.phone,
      isVerified: user.isVerified,
      githubUsername: user.githubUsername,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
