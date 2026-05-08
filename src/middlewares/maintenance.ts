const SKIPPED_PREFIXES = [
  '/admin',
  '/content-manager',
  '/content-type-builder',
  '/email',
  '/i18n',
  '/upload',
  '/users-permissions',
  '/documentation',
  '/_health',
];

type MaintenanceSettings = {
  enabled?: boolean;
  title?: string;
  message?: string;
  estimatedEnd?: string;
  supportEmail?: string;
  backgroundColor?: string;
  textColor?: string;
};

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderMaintenancePage = (settings: MaintenanceSettings) => {
  const title = escapeHtml(settings.title || 'Portal en mantenimiento');
  const message = escapeHtml(
    settings.message ||
      'Estamos realizando tareas de mantenimiento. El servicio volverá a estar disponible pronto.'
  );
  const estimatedEnd = settings.estimatedEnd
    ? `<p class="meta">Finalización estimada: ${escapeHtml(settings.estimatedEnd)}</p>`
    : '';
  const supportEmail = settings.supportEmail
    ? `<p class="meta">Contacto: <a href="mailto:${escapeHtml(settings.supportEmail)}">${escapeHtml(
        settings.supportEmail
      )}</a></p>`
    : '';
  const backgroundColor = escapeHtml(settings.backgroundColor || '#f6f8fb');
  const textColor = escapeHtml(settings.textColor || '#1f2937');

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 32px;
      background: ${backgroundColor};
      color: ${textColor};
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    main {
      width: min(680px, 100%);
      text-align: center;
    }
    h1 {
      margin: 0 0 16px;
      font-size: clamp(2rem, 5vw, 3.25rem);
      line-height: 1.08;
      letter-spacing: 0;
    }
    p {
      margin: 0 auto 12px;
      max-width: 58ch;
      font-size: 1.125rem;
    }
    .meta {
      font-size: 0.95rem;
      opacity: 0.78;
    }
    a {
      color: inherit;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <p>${message}</p>
    ${estimatedEnd}
    ${supportEmail}
  </main>
</body>
</html>`;
};

export default (_config: any, { strapi }: { strapi: any }) => {
  let cachedSettings: MaintenanceSettings | null = null;
  let lastCheck = 0;
  const cacheMs = Number(process.env.MAINTENANCE_CACHE_MS || 10000);

  const getSettings = async () => {
    const now = Date.now();

    if (cachedSettings && now - lastCheck < cacheMs) {
      return cachedSettings;
    }

    lastCheck = now;

    try {
      cachedSettings =
        (await strapi.db.query('api::maintenance-setting.maintenance-setting').findOne()) || {};
    } catch (error) {
      strapi.log.error('No se pudo consultar el modo mantenimiento:', error);
      cachedSettings = {};
    }

    return cachedSettings;
  };

  return async (ctx: any, next: () => Promise<void>) => {
    if (process.env.MAINTENANCE_ENABLED === 'false') {
      return next();
    }

    if (process.env.MAINTENANCE_FORCE_DISABLED === 'true') {
      return next();
    }

    if (!strapi.contentTypes['api::maintenance-setting.maintenance-setting']) {
      return next();
    }

    if (SKIPPED_PREFIXES.some((prefix) => ctx.path.startsWith(prefix))) {
      return next();
    }

    const settings = await getSettings();

    if (!settings.enabled) {
      return next();
    }

    ctx.set('Retry-After', process.env.MAINTENANCE_RETRY_AFTER || '3600');
    ctx.status = 503;

    if (ctx.path.startsWith('/api') || ctx.accepts('json') === 'json') {
      ctx.body = {
        data: null,
        error: {
          status: 503,
          name: 'MaintenanceMode',
          message:
            settings.message ||
            'Estamos realizando tareas de mantenimiento. El servicio volverá a estar disponible pronto.',
          details: {
            title: settings.title || 'Portal en mantenimiento',
            estimatedEnd: settings.estimatedEnd || null,
            supportEmail: settings.supportEmail || null,
          },
        },
      };
      return;
    }

    ctx.type = 'html';
    ctx.body = renderMaintenancePage(settings);
  };
};
