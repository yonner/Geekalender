import type { EventCategory, GeekEvent } from '@geekalender/shared';

export interface EventFilter {
  category?: EventCategory;
  /** 1-12 */
  month?: number;
}

/** Async so a database-backed implementation can replace the in-memory one without changing callers. */
export interface EventRepository {
  list(filter?: EventFilter): Promise<GeekEvent[]>;
  getById(id: string): Promise<GeekEvent | undefined>;
}
