// src/index.ts

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    const auditAction = async (event: any, action: string, model: string) => {
      let entryId: number | null = null;
      let before: any = null;
      let after: any = null;

      // CREATE / UPDATE → event.result existe
      if (event.result && (action === "CREATE" || action === "UPDATE")) {
        entryId = event.result.id;
        after = JSON.stringify(event.result);
      }

      // DELETE → obtener estado previo
      if (action === "DELETE") {
        const rows = await strapi.db.query(model).findMany({
          where: event.where,
        });

        before = rows?.[0] ? JSON.stringify(rows[0]) : null;
        entryId = rows?.[0]?.id ?? null;
      }

      // Guardar fuera de la transacción para evitar errores de Knex
      setImmediate(async () => {
        try {
          await strapi.db.query("api::audit-log.audit-log").create({
            data: {
              action,
              model,
              entry: entryId,
              before,
              after,
              userId: strapi.requestContext?.state?.user?.id ?? null,
            },
          });

          strapi.log.info(`📝 Audit guardado: ${action} → ${model} (id: ${entryId})`);
        } catch (err) {
          strapi.log.error(`❌ Error guardando audit-log (${model}):`, err);
        }
      });
    };

    // Modelos reales de tu instalación, excluyendo audit-log
    const models = Object.keys(strapi.contentTypes).filter(
      (uid) => uid.startsWith("api::") && uid !== "api::audit-log.audit-log"
    );

    // Registrar lifecycles para cada modelo
    models.forEach((uid) => {
      strapi.db.lifecycles.subscribe({
        models: [uid],

        afterCreate(event) {
          auditAction(event, "CREATE", uid);
        },
        afterUpdate(event) {
          auditAction(event, "UPDATE", uid);
        },
        afterDelete(event) {
          auditAction(event, "DELETE", uid);
        },
      });
    });

    // Log de modelos activos
    strapi.log.info("🟢 Audit lifecycle activo para modelos:");
    strapi.log.info(models.map((m) => `   • ${m}`).join("\n"));
  },
};