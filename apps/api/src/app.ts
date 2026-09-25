import cors from 'cors';
import express from 'express';
import { config } from './config';
import type { EventRepository } from './events/eventRepository';
import { errorHandler, notFound } from './middleware/errors';
import { eventsRouter } from './routes/events';
import { healthRouter } from './routes/health';

export interface AppDependencies {
  eventRepository: EventRepository;
}

export function createApp(deps: AppDependencies) {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/events', eventsRouter(deps.eventRepository));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
