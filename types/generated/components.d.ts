import type { Schema, Struct } from '@strapi/strapi';

export interface ContentContentPageFlex extends Struct.ComponentSchema {
  collectionName: 'components_content_content_page_flexes';
  info: {
    displayName: 'Content Page Flex';
  };
  attributes: {};
}

export interface SharedImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['opciones']>;
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<6>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images', true>;
    order: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'image'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedPdf extends Struct.ComponentSchema {
  collectionName: 'components_shared_pdfs';
  info: {
    displayName: 'Pdf';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['opciones']>;
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<6>;
    description: Schema.Attribute.Text;
    order: Schema.Attribute.Integer & Schema.Attribute.Required;
    pdf: Schema.Attribute.Media<'files', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.String &
      Schema.Attribute.Private &
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
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedVideo extends Struct.ComponentSchema {
  collectionName: 'components_shared_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['opciones']>;
    col: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<6>;
    description: Schema.Attribute.Text;
    enlace: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<'plugin::video-field.video'>;
    iframe: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<'plugin::oembed.oembed'>;
    order: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'video'>;
    video: Schema.Attribute.Media<'videos', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.content-page-flex': ContentContentPageFlex;
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
