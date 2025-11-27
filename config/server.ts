export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('APP_URL'),
  proxy: true, // <- importante para HTTPS detrás de Traefik
  app: {
    keys: env.array('APP_KEYS'),
  },
});