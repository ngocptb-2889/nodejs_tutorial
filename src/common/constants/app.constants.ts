export const DEFAULT_VERSION = '1';
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_I18N_DIR = '../i18n/';
export const PREFIX_API = 'api'
export const LIMIT_IMAGE_SIZE = 5 * 1024 * 1024;
export const IMAGE_FILE_TYPE = /^image\/(jpeg|jpg|png|gif|webp)$/;

export const FIELD_LENGTH = {
  // Article entity
  TITLE_MIN: 5,
  TITLE_MAX: 255,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 500,
  SLUG_MIN: 5,
  SLUG_MAX: 255,
  BODY_MIN: 10,
  BODY_MAX: 10000,
  
  // Tag entity
  TAG_NAME_MIN: 1,
  TAG_NAME_MAX: 100,
} as const;

export const PAGE = 1;
export const PER_PAGE = 20;
export const MIN_DEFAULT = 1;
export const OFFSET_DEFAULT = 0;