/**
 * home controller
 */

import { factories } from '@strapi/strapi';

const ensureSliderPopulate = (ctx: any) => {
  if (!ctx.query) {
    ctx.query = {};
  }

  // Si no hay populate o viene como wildcard '*', asegurar populate de componentes requeridos
  if (!ctx.query.populate || ctx.query.populate === '*') {
    ctx.query.populate = {
      Slider: {
        populate: {
          slides: {
            populate: {
              image: true
            }
          }
        }
      },
      Services_Buttons: {
        populate: '*'
      },
      SEO: {
        populate: '*'
      },
      Menu: {
        populate: '*'
      }
    };
    return;
  }

  if (typeof ctx.query.populate === 'object' && !Array.isArray(ctx.query.populate)) {
    // Si viene Slider como booleano o '*'
    if (!ctx.query.populate.Slider || ctx.query.populate.Slider === true || ctx.query.populate.Slider === '*') {
      ctx.query.populate.Slider = {
        populate: {
          slides: {
            populate: {
              image: true
            }
          }
        }
      };
    } else if (typeof ctx.query.populate.Slider === 'object') {
      const sliderPop = ctx.query.populate.Slider.populate;
      if (!sliderPop || sliderPop === '*' || sliderPop === true) {
        ctx.query.populate.Slider.populate = {
          slides: {
            populate: {
              image: true
            }
          }
        };
      } else if (typeof sliderPop === 'object') {
        if (!sliderPop.slides || sliderPop.slides === '*' || sliderPop.slides === true) {
          sliderPop.slides = {
            populate: {
              image: true
            }
          };
        }
        // Eliminar 'files' si algún cliente lo envía para evitar error 400
        if (sliderPop.files !== undefined) {
          delete sliderPop.files;
        }
      }
    }
  }
};

export default factories.createCoreController('api::home.home', ({ strapi }) => ({
  async find(ctx) {
    ensureSliderPopulate(ctx);
    return await super.find(ctx);
  }
}));
