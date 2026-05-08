const DEFAULT_PERMISSIONS_POLICY = [
  'accelerometer=()',
  'camera=()',
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'payment=()',
  'usb=()',
].join(', ');

export default () => {
  return async (ctx: any, next: () => Promise<void>) => {
    ctx.set('X-Content-Type-Options', 'nosniff');
    ctx.set('X-Frame-Options', 'SAMEORIGIN');
    ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    ctx.set('Permissions-Policy', process.env.PERMISSIONS_POLICY || DEFAULT_PERMISSIONS_POLICY);
    ctx.set('X-XSS-Protection', '0');

    if (process.env.NODE_ENV === 'production') {
      ctx.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    await next();
  };
};
