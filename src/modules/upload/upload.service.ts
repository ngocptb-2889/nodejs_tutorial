import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { I18nService } from 'nestjs-i18n';
import { join } from 'path';
import { extname } from 'path';

@Injectable()
export class UploadService {
  constructor(private readonly i18n: I18nService) {}
  private readonly uploadPath = join(process.cwd(), 'uploads', 'images');

  async onModuleInit() {
    await this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch (error) {
      console.error('Failed to access upload directory:', error);
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
        throw new BadRequestException(this.i18n.translate('app.validation.invalidFileData'));
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
    const filename = `image-${uniqueSuffix}${ext}`;
    const filePath = join(this.uploadPath, filename);

    await fs.writeFile(filePath, file.buffer);

    return `/uploads/images/${filename}`;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const filename = imageUrl.split('/').pop();
      if (!filename) {
        return;
      }

      const filePath = join(this.uploadPath, filename);
      
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Error accessing or deleting file: ${filePath}`, error);
      }
    } catch (error) {
      console.warn(`Failed to delete image: ${imageUrl}`, error);
    }
  }
}
