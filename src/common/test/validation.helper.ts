import { ValidationPipe } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class ValidationTestHelper {
  static async validateDto<T extends object>(
    dtoClass: new () => T,
    data: any
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const dto = plainToInstance(dtoClass, data);
    const validationErrors = await validate(dto);

    if (validationErrors.length === 0) {
      return { isValid: true, errors: [] };
    }

    const errors = validationErrors.map(error => 
      Object.values(error.constraints || {})
    ).flat();

    return { isValid: false, errors };
  }

  static createValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    });
  }
}