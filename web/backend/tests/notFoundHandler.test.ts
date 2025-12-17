import request from 'supertest';
import express, { Application } from 'express';
import { notFoundHandler } from '../src/middleware/notFoundHandler';
import { errorHandler } from '../src/middleware/errorHandler';

describe('Not Found Handler Middleware', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it('should return 404 for unmatched routes', async () => {
    app.get('/existing-route', (_req, res) => {
      res.json({ success: true });
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const response = await request(app).get('/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty('message', expect.stringContaining('Not Found'));
  });

  it('should not affect existing routes', async () => {
    app.get('/existing-route', (_req, res) => {
      res.json({ success: true, data: 'Found' });
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const response = await request(app).get('/existing-route');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data', 'Found');
  });

  it('should handle 404 for POST requests to non-existent routes', async () => {
    app.post('/api/users', (_req, res) => {
      res.json({ success: true });
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const response = await request(app).post('/api/posts').send({ title: 'Test' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty('message', expect.stringContaining('Not Found'));
  });

  it('should handle 404 for all HTTP methods', async () => {
    app.get('/test', (_req, res) => res.json({ method: 'GET' }));
    app.use(notFoundHandler);
    app.use(errorHandler);

    const putResponse = await request(app).put('/non-existent');
    const deleteResponse = await request(app).delete('/non-existent');
    const patchResponse = await request(app).patch('/non-existent');

    expect(putResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);
    expect(patchResponse.status).toBe(404);
  });
});
