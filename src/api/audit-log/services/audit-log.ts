/**
 * audit-log service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::audit-log.audit-log', ({ strapi }) => ({
  // Método extra para crear logs
  async createLog({ action, model, entry, userId, before, after }) {
    return await strapi.db
      .query("api::audit-log.audit-log")
      .create({
        data: { action, model, entry, userId, before, after },
      });
  },
}));