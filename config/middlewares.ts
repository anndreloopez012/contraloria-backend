export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://static.cloudflareinsights.com"],
          "connect-src": ["'self'", "https://static.cloudflareinsights.com"],
          "img-src": ["'self'", "data:", "blob:"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "font-src": ["'self'", "data:"],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: '*', // permite cualquier dominio
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: '*',
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];