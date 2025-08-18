import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['es', 'en'], // Idiomas disponibles
    locale: 'es',          // Idioma por defecto (opcional en Strapi v5, pero lo dejamos explícito)
  },
  bootstrap(app: StrapiApp) {
    // En producción puedes eliminar este console.log
    // console.log(app);
  },
};