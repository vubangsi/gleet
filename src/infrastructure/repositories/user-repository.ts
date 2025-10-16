import { User } from '@/domain/user/entities/user'
import { Email } from '@/domain/shared/value-objects/email'
import { prisma } from '../database/prisma-client'

export interface IUserRepository {
  save(user: User): Promise<void>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  exists(email: string): Promise<boolean>
}

export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      phone: user.phone,
      passwordHash: user.passwordHash,
      isVerified: user.isVerified,
      githubToken: user.githubToken,
      githubUsername: user.githubUsername,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    await prisma.user.upsert({
      where: { id: user.id },
      update: userData,
      create: userData,
    })
  }

  async findById(id: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { id },
    })

    if (!userData) return null

    return User.fromPersistence({
      id: userData.id,
      name: userData.name,
      email: Email.create(userData.email),
      phone: userData.phone || undefined,
      passwordHash: userData.passwordHash,
      isVerified: userData.isVerified,
      githubToken: userData.githubToken || undefined,
      githubUsername: userData.githubUsername || undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!userData) return null

    return User.fromPersistence({
      id: userData.id,
      name: userData.name,
      email: Email.create(userData.email),
      phone: userData.phone || undefined,
      passwordHash: userData.passwordHash,
      isVerified: userData.isVerified,
      githubToken: userData.githubToken || undefined,
      githubUsername: userData.githubUsername || undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    })
  }

  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email: email.toLowerCase() },
    })
    return count > 0
  }
}
