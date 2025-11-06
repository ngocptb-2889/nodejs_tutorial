import { ResetPasswordDto } from './reset-password.dto';
import { ValidationTestHelper } from 'src/common/test/validation.helper';

describe('ResetPasswordDto Validation', () => {
  const validPassword = 'Password123!';

  describe('password', () => {
    it('should accept valid password', async () => {
      const dto = { password: validPassword, passwordConfirmation: validPassword };
      const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, dto);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('should reject too short password', async () => {
      const dto = { password: 'Ab1!', passwordConfirmation: 'Ab1!' };
      const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, dto);
      expect(isValid).toBe(false);
      expect(errors.some(e => e.toLowerCase().includes('short'))).toBe(true);
    });

    it('should reject password not matching complexity rule', async () => {
      const invalids = ['password', 'PASSWORD', 'Password', 'password123', '123456789'];
      for (const password of invalids) {
        const dto = { password, passwordConfirmation: password };
        const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, dto);
        expect(isValid).toBe(false);
        expect(errors.some(e => e.toLowerCase().includes('complexity'))).toBe(true);
      }
    });
  });

  describe('passwordConfirmation', () => {
    it('should require passwordConfirmation field', async () => {
      const dto = { password: validPassword };
      const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, dto);
      expect(isValid).toBe(false);
      expect(errors.some(e => e.toLowerCase().includes('passwordconfirmation'))).toBe(true);
    });

    it('should reject too short passwordConfirmation', async () => {
      const dto = { password: validPassword, passwordConfirmation: 'A1!' };
      const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, dto);
      expect(isValid).toBe(false);
      expect(errors.some(e => e.toLowerCase().includes('short'))).toBe(true);
    });

    it('should reject passwordConfirmation that does not match password', async () => {
      const dto = { password: validPassword, passwordConfirmation: 'Password123?' };
      const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, dto);
      expect(isValid).toBe(false);
      expect(errors.some(e => e.toLowerCase().includes('match'))).toBe(true);
    });

    it('should accept matching password and passwordConfirmation', async () => {
      const dto = { password: validPassword, passwordConfirmation: validPassword };
      const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, dto);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });
  });

  describe('complete DTO', () => {
    it('should reject DTO with both fields missing', async () => {
      const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, {});
      expect(isValid).toBe(false);
      expect(errors.length).toBeGreaterThanOrEqual(2);
      expect(errors.some(e => e.toLowerCase().includes('password'))).toBe(true);
    });

    it('should reject if only one field is present', async () => {
      const dto1 = { password: validPassword };
      const dto2 = { passwordConfirmation: validPassword };
      const r1 = await ValidationTestHelper.validateDto(ResetPasswordDto, dto1);
      const r2 = await ValidationTestHelper.validateDto(ResetPasswordDto, dto2);

      expect(r1.isValid).toBe(false);
      expect(r2.isValid).toBe(false);
    });

    it('should accept valid reset data', async () => {
      const dto = { password: validPassword, passwordConfirmation: validPassword };
      const { isValid, errors } = await ValidationTestHelper.validateDto(ResetPasswordDto, dto);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });
  });
});
