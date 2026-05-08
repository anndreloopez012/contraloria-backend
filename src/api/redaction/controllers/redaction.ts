/**
 * redaction controller
 */

import { factories } from '@strapi/strapi'

const normalizeSeoPopulate = (ctx: any) => {
  const populate = ctx.query?.populate;

  if (!populate || typeof populate !== 'object' || Array.isArray(populate)) {
    return;
  }

  if (populate.seo && !populate.SEO) {
    populate.SEO = populate.seo;
    delete populate.seo;
  }
};

const addSeoAlias = (payload: any) => {
  const addAliasToEntry = (entry: any) => {
    if (!entry || typeof entry !== 'object') {
      return entry;
    }

    if (entry.SEO && !entry.seo) {
      entry.seo = entry.SEO;
    }

    if (entry.attributes?.SEO && !entry.attributes.seo) {
      entry.attributes.seo = entry.attributes.SEO;
    }

    return entry;
  };

  if (Array.isArray(payload?.data)) {
    payload.data = payload.data.map(addAliasToEntry);
    return payload;
  }

  if (payload?.data) {
    payload.data = addAliasToEntry(payload.data);
  }

  return payload;
};

export default factories.createCoreController('api::redaction.redaction', ({ strapi }) => ({
  async find(ctx) {
    normalizeSeoPopulate(ctx);

    const response = await super.find(ctx);

    return addSeoAlias(response);
  },

  async findOne(ctx) {
    normalizeSeoPopulate(ctx);

    const response = await super.findOne(ctx);

    return addSeoAlias(response);
  },
}));
