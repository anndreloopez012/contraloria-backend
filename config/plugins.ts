export default () => ({

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

    // Plugin Video Field
    'video-field': {
        enabled: true,
    },

});