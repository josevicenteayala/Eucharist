import { HelmetOptions } from 'helmet';
import { config } from './env';

/**
 * Helmet.js Security Headers Configuration for Eucharist Platform API
 *
 * Helmet helps secure Express apps by setting various HTTP security headers.
 * These configurations protect against common web vulnerabilities.
 */

/**
 * Production-ready Helmet configuration with strict security
 */
export const helmetOptions: HelmetOptions = {
  // Content Security Policy - Prevents XSS attacks
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },

  // Cross-Origin-Embedder-Policy - Prevents document from loading cross-origin resources
  crossOriginEmbedderPolicy: true,

  // Cross-Origin-Opener-Policy - Isolates browsing context from cross-origin windows
  crossOriginOpenerPolicy: { policy: 'same-origin' },

  // Cross-Origin-Resource-Policy - Prevents other domains from reading the response
  crossOriginResourcePolicy: { policy: 'same-origin' },

  // DNS Prefetch Control - Controls browser DNS prefetching
  dnsPrefetchControl: { allow: false },

  // Frameguard - Prevents clickjacking attacks
  frameguard: { action: 'deny' },

  // Hide Powered-By - Remove X-Powered-By header
  hidePoweredBy: true,

  // HSTS (HTTP Strict Transport Security) - Forces HTTPS
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },

  // IE No Open - Sets X-Download-Options for IE8+
  ieNoOpen: true,

  // No Sniff - Prevents MIME type sniffing
  noSniff: true,

  // Origin Agent Cluster - Requests origin-keyed agent clusters
  originAgentCluster: true,

  // Permitted Cross Domain Policies - Controls Adobe Flash and PDF behavior
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },

  // Referrer Policy - Controls Referer header
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

  // XSS Filter - Legacy XSS protection (mostly for old browsers)
  xssFilter: true,
};

/**
 * Development-friendly Helmet configuration with relaxed CSP
 * Allows for hot-reloading and development tools
 */
export const helmetOptionsDev: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow eval for dev tools
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      connectSrc: ["'self'", 'ws:', 'wss:'], // Allow WebSocket for hot reload
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Relaxed for development
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Relaxed for development
  dnsPrefetchControl: { allow: true },
  frameguard: { action: 'sameorigin' }, // Allow same-origin frames
  hidePoweredBy: true,
  hsts: false, // Disabled in development (local HTTP)
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'no-referrer-when-downgrade' },
  xssFilter: true,
};

/**
 * Get appropriate Helmet configuration based on environment
 */
export const getHelmetOptions = (): HelmetOptions => {
  return config.nodeEnv === 'production' ? helmetOptions : helmetOptionsDev;
};
