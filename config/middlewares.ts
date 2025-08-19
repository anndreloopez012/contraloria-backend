export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost',
        'https://cgc-adm.server-softplus.plus',
        'https://cgc.server-softplus.plus',
        'https://server-softplus.plus',
        'http://91.99.220.119:1337',   
        'http://91.99.220.119'   
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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