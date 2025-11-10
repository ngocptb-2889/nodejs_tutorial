import { VALID_PASSWORD_EXAMPLE } from 'src/common';
import { LoginDto } from './login.dto';
import { EmailValidationTestHelper, PasswordValidationTestHelper, ValidationTestHelper } from 'src/common/test/validation.helper';

describe('LoginDto Validation', () => {
    const validData = {
        email: 'user@example.com',
        password: VALID_PASSWORD_EXAMPLE,
    };

    describe('email', () => {
        EmailValidationTestHelper.validateEmailField(LoginDto, validData, true);
    });

    describe('password', () => {
        PasswordValidationTestHelper.validatePasswordField(LoginDto, validData, true);
    });

    describe('complete DTO', () => {
        it('should accept valid login data', async () => {
            const dto = { ...validData };
            const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        });

        it('should reject missing both email and password', async () => {
            const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, {});
            expect(isValid).toBe(false);
            expect(errors.length).toBeGreaterThanOrEqual(2);
            expect(errors.some(e => e.toLowerCase().includes('email'))).toBe(true);
            expect(errors.some(e => e.toLowerCase().includes('password'))).toBe(true);
        });
    });
});
