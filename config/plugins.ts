export default ({ env }) => ({

    // Plugin SEO
    seo: {
        enabled: true,
    },

    // Plugin de documentación (Swagger)
    documentation: {
        enabled: true,
    },

    // Plugin Strapi Prometheus
    prometheus: {
        enabled: true,
        config: {
            collectDefaultMetrics: {
                timeout: 5000,
            },
        },
    },

    // Plugin Email (Nodemailer)
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST'),
                port: env.int('SMTP_PORT', 465),
                secure: true, // OBLIGATORIO para el puerto 465
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
            settings: {
                defaultFrom: 'no-reply@softplusgt.com',
                defaultReplyTo: 'soporte@softplusgt.com',
            },
        },
    },


    // Plugin Video Field
    'video-field': {
        enabled: true,
    },

});