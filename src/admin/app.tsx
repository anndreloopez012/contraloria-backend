import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['es', 'en'], // Idiomas disponibles
    locale: 'es',          // Idioma por defecto
  },
  bootstrap(app: StrapiApp) {
    // En producción puedes eliminar este console.log
    // console.log(app);

    // Agregar Cloudflare Insights
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015';
      script.defer = true;
      document.head.appendChild(script);
    }
  },
};