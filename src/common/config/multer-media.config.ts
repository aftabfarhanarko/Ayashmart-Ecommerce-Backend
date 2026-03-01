import { memoryStorage } from 'multer';

export const mediaMulterConfig = {
  storage: memoryStorage(),
  // 20MB limit (same as before)
  limits: { fileSize: 20 * 1024 * 1024 },
};
