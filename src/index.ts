export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    const auditAction = async (event: any, action: string, model: string) => {
      const { result, params } = event;

      try {
        await strapi.db.query("api::audit-log.audit-log").create({
          data: {
            action,
            model,
            entry: result?.id || null,
            // userId no viene en lifecycle → si quieres capturarlo necesitas middleware en requests
            userId: null,
            before: action === "DELETE" ? result : null,
            after: action !== "DELETE" ? result : null,
          },
        });
      } catch (err) {
        strapi.log.error(`Error guardando audit-log para ${model}:`, err);
      }
    };

    // Recorre todos los modelos (menos el propio audit-log y los de plugins)
    Object.keys(strapi.contentTypes).forEach((modelKey) => {
      const contentType = strapi.contentTypes[modelKey];

      if (contentType.plugin || modelKey === "api::audit-log.audit-log") return;

      strapi.db.lifecycles.subscribe({
        models: [modelKey],

        afterCreate: (event) => auditAction(event, "CREATE", modelKey),

        afterUpdate: (event) => auditAction(event, "UPDATE", modelKey),

        afterDelete: (event) => auditAction(event, "DELETE", modelKey),
      });
    });
  },
};
