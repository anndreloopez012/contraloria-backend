import type { Schema, Struct } from '@strapi/strapi';

export interface ContentContentPageFlex extends Struct.ComponentSchema {
  collectionName: 'components_content_content_page_flexes';
  info: {
    displayName: 'Content Page Flex';
  };
  attributes: {};
}

export interface ContentServices extends Struct.ComponentSchema {
  collectionName: 'components_content_services';
  info: {
    displayName: 'Servicios';
    icon: 'file';
  };
  attributes: {
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    logo: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    slug: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
  };
}

export interface ContentSocial extends Struct.ComponentSchema {
  collectionName: 'components_content_socials';
  info: {
    displayName: 'Redes sociales';
  };
  attributes: {
    Icon: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    Title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.Configurable;
    url: Schema.Attribute.Text & Schema.Attribute.Configurable;
  };
}

export interface SharedAudio extends Struct.ComponentSchema {
  collectionName: 'components_shared_audio';
  info: {
    displayName: 'Audio';
  };
  attributes: {
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    descrip: Schema.Attribute.String & Schema.Attribute.Configurable;
    files: Schema.Attribute.Media<'audios', true> &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.Configurable;
    type: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Configurable &
      Schema.Attribute.DefaultTo<'audio'>;
  };
}

export interface SharedImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_images';
  info: {
    displayName: 'Im\u00E1genes';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['opciones']> &
      Schema.Attribute.Configurable;
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable &
      Schema.Attribute.DefaultTo<6>;
    description: Schema.Attribute.Text & Schema.Attribute.Configurable;
    image: Schema.Attribute.Media<'images', true> &
      Schema.Attribute.Configurable;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    type: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.Configurable &
      Schema.Attribute.DefaultTo<'image'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Medios';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
  };
}

export interface SharedPdf extends Struct.ComponentSchema {
  collectionName: 'components_shared_pdfs';
  info: {
    displayName: 'PDFs';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['opciones']> &
      Schema.Attribute.Configurable;
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable &
      Schema.Attribute.DefaultTo<6>;
    description: Schema.Attribute.Text & Schema.Attribute.Configurable;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    pdf: Schema.Attribute.Media<'files', true> &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    type: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.Configurable &
      Schema.Attribute.DefaultTo<'pdf'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Content';
    icon: 'align-justify';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['opciones']>;
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<6>;
    content: Schema.Attribute.RichText;
    description: Schema.Attribute.Text;
    order: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'content'>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'SEO';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    shareImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Configurable;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider de im\u00E1genes';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true> &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
  };
}

export interface SharedVideo extends Struct.ComponentSchema {
  collectionName: 'components_shared_videos';
  info: {
    displayName: 'Videos';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['opciones']> &
      Schema.Attribute.Configurable;
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable &
      Schema.Attribute.DefaultTo<6>;
    description: Schema.Attribute.Text & Schema.Attribute.Configurable;
    enlace: Schema.Attribute.JSON &
      Schema.Attribute.Configurable &
      Schema.Attribute.CustomField<'plugin::video-field.video'>;
    iframe: Schema.Attribute.JSON &
      Schema.Attribute.Configurable &
      Schema.Attribute.CustomField<'plugin::oembed.oembed'>;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Configurable;
    type: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.Configurable &
      Schema.Attribute.DefaultTo<'video'>;
    video: Schema.Attribute.Media<'videos', true> &
      Schema.Attribute.Configurable;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.content-page-flex': ContentContentPageFlex;
      'content.services': ContentServices;
      'content.social': ContentSocial;
      'shared.audio': SharedAudio;
      'shared.image': SharedImage;
      'shared.media': SharedMedia;
      'shared.pdf': SharedPdf;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.video': SharedVideo;
    }
  }
}
