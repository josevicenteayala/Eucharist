import request from 'supertest';
import app from '../src/app';

describe('Security Headers (Helmet.js)', () => {
  describe('Basic Security Headers', () => {
    it('should set X-Content-Type-Options header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should set X-Frame-Options header', async () => {
      const response = await request(app).get('/');

      // Development: sameorigin, Production: deny
      expect(response.headers['x-frame-options']).toMatch(/^(DENY|SAMEORIGIN)$/);
    });

    it('should remove X-Powered-By header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    it('should set Referrer-Policy header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['referrer-policy']).toBeDefined();
    });

    it('should set X-Download-Options header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-download-options']).toBe('noopen');
    });

    it('should set X-XSS-Protection header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-xss-protection']).toBe('0');
    });
  });

  describe('Content Security Policy', () => {
    it('should set Content-Security-Policy header', async () => {
      const response = await request(app).get('/');

      const csp = response.headers['content-security-policy'];
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'self'");
    });

    it('should restrict object-src to none', async () => {
      const response = await request(app).get('/');

      const csp = response.headers['content-security-policy'];
      expect(csp).toContain("object-src 'none'");
    });

    it('should restrict frame sources', async () => {
      const response = await request(app).get('/');

      const csp = response.headers['content-security-policy'];
      expect(csp).toContain("frame-src 'none'");
    });
  });

  describe('Cross-Origin Policies', () => {
    it('should set Cross-Origin-Opener-Policy header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['cross-origin-opener-policy']).toBeDefined();
    });

    it('should set Cross-Origin-Resource-Policy header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['cross-origin-resource-policy']).toBeDefined();
    });

    it('should set Origin-Agent-Cluster header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['origin-agent-cluster']).toBe('?1');
    });
  });

  describe('DNS and Prefetch Control', () => {
    it('should set X-DNS-Prefetch-Control header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-dns-prefetch-control']).toBeDefined();
    });
  });

  describe('Permitted Cross Domain Policies', () => {
    it('should set X-Permitted-Cross-Domain-Policies header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-permitted-cross-domain-policies']).toBe('none');
    });
  });

  describe('Security Headers on API Endpoints', () => {
    it('should apply security headers to health endpoint', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-powered-by']).toBeUndefined();
      expect(response.headers['content-security-policy']).toBeDefined();
    });

    it('should apply security headers to root endpoint', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['referrer-policy']).toBeDefined();
    });
  });
});
