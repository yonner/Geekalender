import { createApp } from './app';
import { config } from './config';
import { InMemoryEventRepository } from './events/inMemoryEventRepository';
import { seedEvents } from './events/seed';

const app = createApp({
  eventRepository: new InMemoryEventRepository(seedEvents),
});

const server = app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});

// ECS stops tasks with SIGTERM; finish in-flight requests, then exit.
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
