import { RegisterUserCommand } from '../commands/register-user-command'
import { IUserRepository } from '@/infrastructure/repositories/user-repository'
import { IEventStore } from '@/infrastructure/events/event-store'
import { User } from '@/domain/user/entities/user'
import bcrypt from 'bcryptjs'

export class RegisterUserHandler {
  constructor(
    private userRepository: IUserRepository,
    private eventStore: IEventStore
  ) {}

  async handle(command: RegisterUserCommand): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(command.email)
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(command.password, 12)

      // Create user
      const userId = crypto.randomUUID()
      const user = User.create(
        userId,
        command.name,
        command.email,
        command.phone,
        passwordHash
      )

      // Save user and events
      await this.userRepository.save(user)
      await this.eventStore.saveEvents(user.getUncommittedEvents())
      
      user.markEventsAsCommitted()

      return { success: true, userId }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }
}
