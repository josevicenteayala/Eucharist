import request from 'supertest';
import app from '../src/app';

describe('CORS Configuration', () => {
  describe('Allowed Origin', () => {
    it('should accept requests from allowed origin', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:3001');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should reject requests from unauthorized origin', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://evil-site.com');

      expect(response.status).toBe(500); // CORS error returns 500
    });

    it('should allow requests without origin in development', async () => {
      // Requests without Origin header (like from curl or mobile apps)
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
    });
  });

  describe('CORS Headers', () => {
    it('should set correct CORS headers for preflight request', async () => {
      const response = await request(app)
        .options('/api/v1/health')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
      expect(response.headers['access-control-allow-methods']).toContain('POST');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
      expect(response.headers['access-control-max-age']).toBe('86400');
    });

    it('should allow common HTTP methods', async () => {
      const response = await request(app)
        .options('/api/v1/health')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Method', 'DELETE');

      expect(response.status).toBe(204);
      const allowedMethods = response.headers['access-control-allow-methods'];
      expect(allowedMethods).toContain('GET');
      expect(allowedMethods).toContain('POST');
      expect(allowedMethods).toContain('PUT');
      expect(allowedMethods).toContain('PATCH');
      expect(allowedMethods).toContain('DELETE');
      expect(allowedMethods).toContain('OPTIONS');
    });

    it('should allow required headers', async () => {
      const response = await request(app)
        .options('/api/v1/health')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Headers', 'Authorization,Content-Type');

      expect(response.status).toBe(204);
      const allowedHeaders = response.headers['access-control-allow-headers'];
      expect(allowedHeaders).toContain('Authorization');
      expect(allowedHeaders).toContain('Content-Type');
      expect(allowedHeaders).toContain('Accept');
      expect(allowedHeaders).toContain('Origin');
    });

    it('should expose required headers', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:3001');

      expect(response.status).toBe(200);
      const exposedHeaders = response.headers['access-control-expose-headers'];
      expect(exposedHeaders).toContain('Content-Type');
      expect(exposedHeaders).toContain('Content-Length');
    });
  });

  describe('Credentials Support', () => {
    it('should support credentials for authenticated requests', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:3001')
        .set('Cookie', 'session=abc123');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });
});
