import { memoryStorage } from 'multer';
import { LIMIT_IMAGE_SIZE } from '../constants/app.constants';

export const imageUploadConfig = {
  storage: memoryStorage(),
  limits: { fileSize: LIMIT_IMAGE_SIZE },
};