const defaultCorsOrigins = [
  'https://adm-cms.contraloria.gob.gt',
  'https://app1.contraloria.gob.gt',
  'https://app2.contraloria.gob.gt',
  'https://app3.contraloria.gob.gt',
  'https://app4.contraloria.gob.gt',
  'https://dev.contraloria.gob.gt',
  'https://contraloria.gob.gt',
];

export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      frameguard: {
        action: 'sameorigin',
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
      },
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": [
            "'self'",
            "'unsafe-inline'",
            "https://static.cloudflareinsights.com"
          ],
          "connect-src": [
            "'self'",
            "https://static.cloudflareinsights.com",
            "https://api.github.com"
          ],
          "img-src": ["'self'", "data:", "blob:"],
          "style-src": ["'self'", "'unsafe-inline'", "https:"],
          "font-src": ["'self'", "data:"],
          "object-src": ["'none'"],
          "base-uri": ["'self'"],
          "frame-ancestors": ["'self'"],
        },
      },
    },
  },
  'global::security-headers',
  {
    name: 'strapi::cors',
    config: {
      origin:
        process.env.CORS_ORIGIN?.split(',')
          .map((origin) => origin.trim().replace(/\/$/, ''))
          .filter(Boolean) || defaultCorsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: [
        'Authorization',
        'Content-Type',
        'Origin',
        'Accept',
        'X-Requested-With',
        'X-CSRF-Token',
        'x-csrf-token',
      ],
    },
  },
  'global::maintenance',
  'global::csrf',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
