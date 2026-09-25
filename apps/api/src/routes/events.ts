import { Router } from 'express';
import {
  isEventCategory,
  type GeekEvent,
  type ItemResponse,
  type ListResponse,
} from '@geekalender/shared';
import type { EventFilter, EventRepository } from '../events/eventRepository';
import { HttpError } from '../middleware/errors';

function parseFilter(query: Record<string, unknown>): EventFilter {
  const filter: EventFilter = {};

  if (query.category !== undefined) {
    if (!isEventCategory(query.category)) throw new HttpError(400, 'Invalid category');
    filter.category = query.category;
  }

  if (query.month !== undefined) {
    const month = Number(query.month);
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new HttpError(400, 'month must be an integer 1-12');
    }
    filter.month = month;
  }

  return filter;
}

export function eventsRouter(repository: EventRepository) {
  const router = Router();

  // Express 5 forwards rejected promises from async handlers to the error middleware.
  router.get('/', async (req, res) => {
    const body: ListResponse<GeekEvent> = { data: await repository.list(parseFilter(req.query)) };
    res.json(body);
  });

  router.get('/:id', async (req, res) => {
    const event = await repository.getById(req.params.id);
    if (!event) throw new HttpError(404, 'Event not found');
    const body: ItemResponse<GeekEvent> = { data: event };
    res.json(body);
  });

  return router;
}
