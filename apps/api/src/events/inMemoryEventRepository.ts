import type { GeekEvent } from '@geekalender/shared';
import type { EventFilter, EventRepository } from './eventRepository';

const monthOf = (isoDate: string) => Number(isoDate.slice(5, 7));
const monthDay = (isoDate: string) => isoDate.slice(5);

export class InMemoryEventRepository implements EventRepository {
  constructor(private readonly events: readonly GeekEvent[]) {}

  async list(filter: EventFilter = {}): Promise<GeekEvent[]> {
    return this.events
      .filter((e) => !filter.category || e.category === filter.category)
      .filter((e) => !filter.month || monthOf(e.date) === filter.month)
      .sort((a, b) => monthDay(a.date).localeCompare(monthDay(b.date)));
  }

  async getById(id: string): Promise<GeekEvent | undefined> {
    return this.events.find((e) => e.id === id);
  }
}
