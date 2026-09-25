import { createApp } from './app';
import { config } from './config';
import { InMemoryEventRepository } from './events/inMemoryEventRepository';
import { seedEvents } from './events/seed';

const app = createApp({
  eventRepository: new InMemoryEventRepository(seedEvents),
});

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
