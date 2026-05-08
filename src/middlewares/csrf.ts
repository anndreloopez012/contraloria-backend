import crypto from 'crypto';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const parseCookies = (cookieHeader = '') =>
  cookieHeader.split(';').reduce<Record<string, string>>((cookies, cookie) => {
    const [rawName, ...rawValue] = cookie.trim().split('=');

    if (!rawName || rawValue.length === 0) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});

const isSecureRequest = (ctx: any) => {
  const forwardedProto = String(ctx.get('x-forwarded-proto') || '')
    .split(',')[0]
    .trim()
    .toLowerCase();

  return ctx.secure || forwardedProto === 'https';
};

export default (_config: any, { strapi }: { strapi: any }) => {
  const enabled = process.env.CSRF_ENABLED !== 'false';
  const cookieName = process.env.CSRF_COOKIE_NAME || 'XSRF-TOKEN';
  const headerName = (process.env.CSRF_HEADER_NAME || 'x-csrf-token').toLowerCase();
  const secureCookie = process.env.CSRF_COOKIE_SECURE
    ? process.env.CSRF_COOKIE_SECURE === 'true'
    : process.env.NODE_ENV === 'production';

  return async (ctx: any, next: () => Promise<void>) => {
    if (!enabled || !ctx.path.startsWith('/api')) {
      return next();
    }

    if (ctx.method === 'OPTIONS') {
      return next();
    }

    const token = ctx.cookies.get(cookieName) || crypto.randomBytes(32).toString('hex');

    const cookieOptions = {
      httpOnly: false,
      overwrite: true,
      sameSite: 'lax',
      secure: secureCookie && isSecureRequest(ctx),
      path: '/',
    };

    try {
      ctx.cookies.set(cookieName, token, cookieOptions);
    } catch (error) {
      strapi.log.warn(
        `No se pudo enviar cookie CSRF segura; se enviará sin atributo Secure. ${error}`
      );
      ctx.cookies.set(cookieName, token, {
        ...cookieOptions,
        secure: false,
      });
    }

    if (SAFE_METHODS.has(ctx.method)) {
      return next();
    }

    const authorization = String(ctx.get('authorization') || '');

    if (authorization.toLowerCase().startsWith('bearer ')) {
      return next();
    }

    const cookies = parseCookies(ctx.request.headers.cookie);
    const cookieToken = cookies[cookieName];
    const headerToken = String(ctx.get(headerName) || '');

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      strapi.log.warn(`CSRF bloqueado: ${ctx.method} ${ctx.path}`);
      ctx.status = 403;
      ctx.body = {
        error: {
          status: 403,
          name: 'ForbiddenError',
          message: 'CSRF token inválido o ausente.',
        },
      };
      return;
    }

    return next();
  };
};
