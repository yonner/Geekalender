import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from './app';
import { InMemoryEventRepository } from './events/inMemoryEventRepository';
import { seedEvents } from './events/seed';

const app = createApp({ eventRepository: new InMemoryEventRepository(seedEvents) });

describe('API', () => {
  it('GET /health', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
  });

  it('filters events by category', async () => {
    const res = await request(app).get('/api/events?category=tv');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.data.every((e: { category: string }) => e.category === 'tv'));
  });

  it('filters events by month', async () => {
    const res = await request(app).get('/api/events?month=5');
    assert.deepEqual(
      res.body.data.map((e: { id: string }) => e.id),
      ['star-wars-release', 'towel-day'],
    );
  });

  it('rejects an invalid category', async () => {
    const res = await request(app).get('/api/events?category=nope');
    assert.equal(res.status, 400);
  });

  it('returns 404 for an unknown event', async () => {
    const res = await request(app).get('/api/events/does-not-exist');
    assert.equal(res.status, 404);
  });
});
