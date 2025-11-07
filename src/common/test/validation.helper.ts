import { ValidationPipe } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PASSWORD_MIN_LENGTH, VALID_PASSWORD_EXAMPLE } from '../constants/user.constants';

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

export class StringValidationTestHelper {
  static async validateStringConstraints<T extends object>(
    dtoClass: new () => T,
    validData: Partial<T>,
    fieldName: string | symbol,
    isRequired: boolean = true,
    minLength?: number,
    maxLength?: number,
    regexPattern?: RegExp
  ) {
    describe(`${String(fieldName)} field`, () => {
      it('should accept valid string', async () => {
        const dto = { ...validData, [fieldName]: 'ValidString' };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(true);
        expect(errors).toHaveLength(0);
      });

      it('should reject non-string value', async () => {
        const dto = { ...validData, [fieldName]: 12345 };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(false);
        expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
      });

      if (minLength !== undefined) {
        it(`should reject string shorter than ${minLength}`, async () => {
          const dto = { ...validData, [fieldName]: 'a'.repeat(minLength - 1) };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
        });
      }

      if (maxLength !== undefined) {
        it(`should reject string longer than ${maxLength}`, async () => {
          const dto = { ...validData, [fieldName]: 'a'.repeat(maxLength + 1) };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
        });
      }

      if(isRequired ) {
        it('should reject missing field', async () => {
          const dataWithoutField = Object.fromEntries(
            Object.entries(validData).filter(([key]) => key !== String(fieldName))
          );
          const dto = { ...dataWithoutField };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true); 
        });
      } else {
        it('should accept missing field', async () => { 
          const dataWithoutField = Object.fromEntries(
            Object.entries(validData).filter(([key]) => key !== String(fieldName))
          );
          const dto = { ...dataWithoutField };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(true);
          expect(errors).toHaveLength(0);
          expect(isValid).toBe(true);
          expect(errors).toHaveLength(0);
        });
      }

      if (regexPattern) {
        it(`should reject string not matching pattern ${regexPattern}`, async () => {
          const dto = { ...validData, [fieldName]: 'Invalid@String#' };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
        });
      }
    });
  }
}

export class NumberValidationTestHelper {
  static async validateNumberConstraints<T extends object>(
    dtoClass: new () => T,
    validData: Partial<T>,
    fieldName: string | symbol,
    minValue?: number,
    isRequired: boolean = true
  ) {
    describe(`${String(fieldName)} field`, () => {
      it('should accept valid number', async () => {
        const dto = { ...validData, [fieldName]: 10 };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(true);
        expect(errors).toHaveLength(0);
      });

      it('should reject non-number value', async () => {
        const dto = { ...validData, [fieldName]: 'not-a-number' };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(false);
        expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
      });

      it('should reject non-integer number', async () => {
        const dto = { ...validData, [fieldName]: 5.5 };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(false);
        expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
      });

      if(minValue !== undefined) {
        it(`should reject number less than ${minValue}`, async () => {
          const dto = { ...validData, [fieldName]: minValue - 1 };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
        });
      }

      if(isRequired ) {
        it('should reject missing field', async () => {
          const dataWithoutField = Object.fromEntries(
            Object.entries(validData).filter(([key]) => key !== String(fieldName))
          );
          const dto = { ...dataWithoutField };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true); 
        });
      } else {
        it('should accept missing field', async () => { 
          const dataWithoutField = Object.fromEntries(
            Object.entries(validData).filter(([key]) => key !== String(fieldName))
          );
          const dto = { ...dataWithoutField };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(true);
          expect(errors).toHaveLength(0);
          expect(isValid).toBe(true);
          expect(errors).toHaveLength(0);
        });
      }
    });
  }
}

export class ArrayStringValidationTestHelper {
  static async validateArrayOfStrings<T extends object>(
    dtoClass: new () => T,
    validData: Partial<T>,
    fieldName: string | symbol,
    isRequired: boolean = true,
    isCanString = false
  ) {
    describe(`${String(fieldName)} field`, () => {
      it('should accept valid array of strings', async () => {
        const dto = { ...validData, [fieldName]: ['string1', 'string2'] };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(true);
        expect(errors).toHaveLength(0);
      });

      if (!isCanString) {
        it('should reject non-array value', async () => {
          const dto = { ...validData, [fieldName]: 'not-an-array' };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
        });
      }

      it('should reject array with non-string elements', async () => {
        const dto = { ...validData, [fieldName]: ['string1', 123, true] };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(false);
        expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true);
      });

      if(isRequired ) {
          it('should reject missing field', async () => {
              const dataWithoutField = Object.fromEntries(
                Object.entries(validData).filter(([key]) => key !== String(fieldName))
              );
              const dto = { ...dataWithoutField };
              const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
              expect(isValid).toBe(false);
              expect(errors.some(e => e.toLowerCase().includes(String(fieldName).toLowerCase()))).toBe(true); 
          });
      } else {
          it('should accept missing field', async () => { 
              const dataWithoutField = Object.fromEntries(
                Object.entries(validData).filter(([key]) => key !== String(fieldName))
              );
              const dto = { ...dataWithoutField };
              const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
              expect(isValid).toBe(true);
              expect(errors).toHaveLength(0);
              expect(isValid).toBe(true);
              expect(errors).toHaveLength(0);
          });
      }
    });
  }
}

export class EmailValidationTestHelper {
  static async validateEmailField<T extends object>(
    dtoClass: new () => T,
    validData: Partial<T>,
    isRequired: boolean = true
  ) {
    describe(`Email field`, () => {
      it('should accept valid email', async () => {
        const dto = { ...validData, email: 'valid.email@gmail.com' };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(true);
        expect(errors).toHaveLength(0);
      });

      it('should reject invalid email formats', async () => {
        const invalidEmails = ['plainaddress', 'missingatsign.com', 'missingdomain@.com', '@missingusername.com'];
        for (const email of invalidEmails) {
          const dto = { ...validData, email };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes('email'))).toBe(true);
        }
      });

      if(isRequired ) {
        it('should reject missing email field', async () => {
          const dataWithoutField = Object.fromEntries(
            Object.entries(validData).filter(([key]) => key !== 'email')
          );
          const dto = { ...dataWithoutField };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes('email'))).toBe(true);
        });
      } else {
        it('should accept missing email field', async () => { 
          const dataWithoutField = Object.fromEntries(
            Object.entries(validData).filter(([key]) => key !== 'email')
          );
          const dto = { ...dataWithoutField };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(true);
          expect(errors).toHaveLength(0);
        });
      }
    });
  }
}

export class PasswordValidationTestHelper {
  static async validatePasswordField<T extends object>(
    dtoClass: new () => T,
    validData: Partial<T>,
    isRequired: boolean = true,
    fieldName: string = 'password'
  ) {
    describe(`Password field`, () => {
      it('should accept valid password', async () => {
        const dto = { ...validData, [fieldName]: VALID_PASSWORD_EXAMPLE };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(true);
        expect(errors).toHaveLength(0);
      });

      it('should reject too short password', async () => {
        const dto = { ...validData, [fieldName]: 'a'.repeat(PASSWORD_MIN_LENGTH - 1) };
        const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
        expect(isValid).toBe(false);
        expect(errors.some(e => e.toLowerCase().includes('short'))).toBe(true);
      });

      it('should reject password without uppercase, lowercase, number, or special char', async () => {
        const invalids = ['password', 'PASSWORD', 'Password', 'password123', 'PASSWORD123', 'Password123'];
        for (const password of invalids) {
          const dto = { ...validData, password, [fieldName]: password };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes('complexity'))).toBe(true);
        }
      });

      if(isRequired) {
        it('should reject missing password field', async () => {
          const dataWithoutField = Object.fromEntries(
            Object.entries(validData).filter(([key]) => key !== fieldName)
          );
          const dto = { ...dataWithoutField };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes('password'))).toBe(true);
        });
      } else {
        it('should accept missing password field', async () => { 
          const dataWithoutField = Object.fromEntries(
            Object.entries(validData).filter(([key]) => key !== fieldName)
          );
          const dto = { ...dataWithoutField };
          const { isValid, errors } = await ValidationTestHelper.validateDto(dtoClass, dto);
          expect(isValid).toBe(true);
          expect(errors).toHaveLength(0);
        });
      }
    });
  }
}
  