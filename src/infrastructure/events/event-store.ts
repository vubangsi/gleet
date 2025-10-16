import { DomainEvent } from '@/domain/shared/events/domain-event'
import { prisma } from '../database/prisma-client'

export interface IEventStore {
  saveEvents(events: DomainEvent[]): Promise<void>
  getEvents(aggregateId: string): Promise<DomainEvent[]>
  getAllUnprocessedEvents(): Promise<DomainEvent[]>
  markEventAsProcessed(eventId: string): Promise<void>
}

export class PrismaEventStore implements IEventStore {
  async saveEvents(events: DomainEvent[]): Promise<void> {
    const eventData = events.map(event => ({
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: JSON.stringify(event.payload),
      version: event.eventVersion,
      occurredOn: event.occurredOn,
    }))

    await prisma.domainEvent.createMany({
      data: eventData,
    })
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    const events = await prisma.domainEvent.findMany({
      where: { aggregateId },
      orderBy: { occurredOn: 'asc' },
    })

    return events.map(event => ({
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: JSON.parse(event.payload),
      eventVersion: event.version,
      occurredOn: event.occurredOn,
    }))
  }

  async getAllUnprocessedEvents(): Promise<DomainEvent[]> {
    const events = await prisma.domainEvent.findMany({
      where: { processedAt: null },
      orderBy: { occurredOn: 'asc' },
    })

    return events.map(event => ({
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: JSON.parse(event.payload),
      eventVersion: event.version,
      occurredOn: event.occurredOn,
    }))
  }

  async markEventAsProcessed(eventId: string): Promise<void> {
    await prisma.domainEvent.update({
      where: { eventId },
      data: { processedAt: new Date() },
    })
  }
}
