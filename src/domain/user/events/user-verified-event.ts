import { BaseDomainEvent } from '@/domain/shared/events/domain-event'

export class UserVerifiedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    payload: {
      email: string
    }
  ) {
    super(aggregateId, 'UserVerified', payload)
  }
}
