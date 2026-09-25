import 'server-only';
import type { EventCategory, GeekEvent, ListResponse } from '@geekalender/shared';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export async function getEvents(filter: { category?: EventCategory } = {}): Promise<GeekEvent[]> {
  const params = new URLSearchParams();
  if (filter.category) params.set('category', filter.category);

  const res = await fetch(`${API_URL}/api/events?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /api/events failed: ${res.status}`);

  const body = (await res.json()) as ListResponse<GeekEvent>;
  return body.data;
}
