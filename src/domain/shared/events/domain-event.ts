export interface DomainEvent {
  readonly eventId: string
  readonly aggregateId: string
  readonly eventType: string
  readonly occurredOn: Date
  readonly eventVersion: number
  readonly payload: Record<string, any>
}

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly eventId: string
  public readonly occurredOn: Date
  public readonly eventVersion: number = 1

  constructor(
    public readonly aggregateId: string,
    public readonly eventType: string,
    public readonly payload: Record<string, any> = {}
  ) {
    this.eventId = crypto.randomUUID()
    this.occurredOn = new Date()
  }
}
