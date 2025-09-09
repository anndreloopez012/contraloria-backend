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
          "script-src": ["'self'", "https://static.cloudflareinsights.com"],
          "connect-src": [
            "'self'",
            "https://static.cloudflareinsights.com",
            "https://api.github.com"
          ],
          "img-src": ["'self'", "data:", "blob:"],
          "style-src": ["'self'"],
          "font-src": ["'self'", "data:"],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: '*',
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