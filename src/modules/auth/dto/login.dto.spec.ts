import { LoginDto } from './login.dto';
import { ValidationTestHelper } from 'src/common/test/validation.helper';

describe('LoginDto Validation', () => {
    const validData = {
        email: 'user@example.com',
        password: 'Password123!',
    };

    describe('email', () => {
        it('should accept valid email', async () => {
            const dto = { ...validData, email: 'valid.email@domain.com' };
            const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        });

        it('should reject invalid email format', async () => {
            const invalidEmails = ['plainaddress', 'user@', 'user@domain', '@nodomain.com', ' '];
            for (const email of invalidEmails) {
                const dto = { ...validData, email };
                const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, dto);
                expect(isValid).toBe(false);
                expect(errors.some(e => e.toLowerCase().includes('email'))).toBe(true);
            }
        });

        it('should require email field', async () => {
            const dto = { ...validData, email: undefined };
            const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('required'))).toBe(true);
        });
    });

    describe('password', () => {
        it('should accept valid password', async () => {
            const dto = { ...validData };
            const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        });

        it('should reject too short password', async () => {
            const dto = { ...validData, password: 'Ab1!' };
            const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('short'))).toBe(true);
        });

        it('should reject password without uppercase, lowercase, number, or special char', async () => {
            const invalids = ['password', 'PASSWORD', 'Password', 'password123', 'PASSWORD123', 'Password123'];
            for (const password of invalids) {
                const dto = { ...validData, password };
                const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, dto);
                expect(isValid).toBe(false);
                expect(errors.some(e => e.toLowerCase().includes('complexity'))).toBe(true);
            }
        });

        it('should require password field', async () => {
            const dto = { ...validData, password: undefined };
            const { isValid, errors } = await ValidationTestHelper.validateDto(LoginDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('password'))).toBe(true);
        });
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
