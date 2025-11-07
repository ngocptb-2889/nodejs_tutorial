import { UpdateUserDto } from './update-user.dto';
import {
  BIO_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from 'src/common';
import { ValidationTestHelper } from 'src/common/test/validation.helper';

describe('UpdateUserDto', () => {
  describe('email', () => {
    it('should accept valid emails', async () => {
        const validEmails = ['user@example.com', 'a.b+1@domain.co', 'test_email@xyz.vn'];
        for (const email of validEmails) {
            const dto = { email };
            const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateUserDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        }
    });

    it('should reject invalid emails', async () => {
        const invalidEmails = ['plainaddress', '@missinguser.com', 'user@', 'user@domain', ' '];
        for (const email of invalidEmails) {
            const dto = { email };
            const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateUserDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('email'))).toBe(true);
        }
    });
  });

  describe('username', () => {
    it('should accept valid username', async () => {
        const usernames = ['abcde', 'john_doe', 'user123', 'ValidUser'];
        for (const username of usernames) {
            const dto = { username };
            const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateUserDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        }
    });

    it('should reject username shorter than min length', async () => {
        const shortUsername = 'a'.repeat(USERNAME_MIN_LENGTH - 1);
        const dto = { username: shortUsername };
        const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateUserDto, dto);
        expect(isValid).toBe(false);
        expect(errors.some(e => e.toLowerCase().includes('short'))).toBe(true);
    });

    it('should reject username longer than max length', async () => {
        const longUsername = 'a'.repeat(USERNAME_MAX_LENGTH + 1);
        const dto = { username: longUsername };
        const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateUserDto, dto);
        expect(isValid).toBe(false);
        expect(errors.some(e => e.toLowerCase().includes('long'))).toBe(true);
    });

    it('should reject username with invalid characters', async () => {
        const invalidNames = ['user name', 'name@', 'wrong!'];
        for (const username of invalidNames) {
            const dto = { username };
            const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateUserDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('invalid'))).toBe(true);
        }
    });
  });

  describe('optional fields', () => {
      it('should reject too long bio', async () => {
          const bio = 'a'.repeat(BIO_MAX_LENGTH + 1);
          const dto = { bio };
          const { isValid, errors } = await ValidationTestHelper.validateDto(UpdateUserDto, dto);
          expect(isValid).toBe(false);
          expect(errors.some(e => e.toLowerCase().includes('bio'))).toBe(true);
      });
  });
});
