import { BaseDomainEvent } from '@/domain/shared/events/domain-event'

export class UserRegisteredEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    payload: {
      name: string
      email: string
      phone?: string
    }
  ) {
    super(aggregateId, 'UserRegistered', payload)
  }
}
