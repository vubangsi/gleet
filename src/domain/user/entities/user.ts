import { AggregateRoot } from '@/domain/shared/aggregate-root'
import { Email } from '@/domain/shared/value-objects/email'
import { UserRegisteredEvent } from '../events/user-registered-event'
import { UserVerifiedEvent } from '../events/user-verified-event'

export interface UserProps {
  id: string
  name: string
  email: Email
  phone?: string
  passwordHash: string
  isVerified: boolean
  githubToken?: string
  githubUsername?: string
  createdAt: Date
  updatedAt: Date
}

export class User extends AggregateRoot {
  private constructor(private props: UserProps) {
    super()
  }

  static create(
    id: string,
    name: string,
    email: string,
    phone: string | undefined,
    passwordHash: string
  ): User {
    const emailVO = Email.create(email)
    const user = new User({
      id,
      name,
      email: emailVO,
      phone,
      passwordHash,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    user.addDomainEvent(
      new UserRegisteredEvent(id, {
        name,
        email: emailVO.getValue(),
        phone,
      })
    )

    return user
  }

  static fromPersistence(props: UserProps): User {
    return new User(props)
  }

  verify(): void {
    if (this.props.isVerified) {
      throw new Error('User is already verified')
    }

    this.props.isVerified = true
    this.props.updatedAt = new Date()

    this.addDomainEvent(
      new UserVerifiedEvent(this.props.id, {
        email: this.props.email.getValue(),
      })
    )
  }

  updateGitHubIntegration(token: string, username: string): void {
    this.props.githubToken = token
    this.props.githubUsername = username
    this.props.updatedAt = new Date()
  }

  // Getters
  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get email(): Email {
    return this.props.email
  }

  get phone(): string | undefined {
    return this.props.phone
  }

  get passwordHash(): string {
    return this.props.passwordHash
  }

  get isVerified(): boolean {
    return this.props.isVerified
  }

  get githubToken(): string | undefined {
    return this.props.githubToken
  }

  get githubUsername(): string | undefined {
    return this.props.githubUsername
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      email: this.props.email.getValue(),
      phone: this.props.phone,
      isVerified: this.props.isVerified,
      githubUsername: this.props.githubUsername,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}
