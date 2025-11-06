import { SignupDto } from './signup.dto';
import { ValidationTestHelper } from 'src/common/test/validation.helper';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  BIO_MAX_LENGTH,
} from 'src/common';

describe('SignupDto Validation', () => {
    const validData = {
        email: 'user@example.com',
        username: 'validuser',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
    };

    describe('email', () => {
        it('should accept valid emails', async () => {
            const validEmails = ['user@example.com', 'a.b+1@domain.co', 'test_email@xyz.vn'];
            for (const email of validEmails) {
                const dto = { ...validData, email };
                const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
                expect(isValid).toBe(true);
                expect(errors).toHaveLength(0);
            }
        });

        it('should reject invalid emails', async () => {
            const invalidEmails = ['plainaddress', '@missinguser.com', 'user@', 'user@domain', ' '];
            for (const email of invalidEmails) {
                const dto = { ...validData, email };
                const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
                expect(isValid).toBe(false);
                expect(errors.some(e => e.toLowerCase().includes('email'))).toBe(true);
            }
        });

        it('should require email field', async () => {
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, {
                ...validData,
                email: undefined,
            });
            expect(isValid).toBe(false);
            expect(errors.some(e => e.includes('email'))).toBe(true);
        });
    });

    describe('username', () => {
        it('should accept valid username', async () => {
            const usernames = ['abcde', 'john_doe', 'user123', 'ValidUser'];
            for (const username of usernames) {
                const dto = { ...validData, username };
                const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
                expect(isValid).toBe(true);
                expect(errors).toHaveLength(0);
            }
        });

        it('should reject username shorter than min length', async () => {
            const shortUsername = 'a'.repeat(USERNAME_MIN_LENGTH - 1);
            const dto = { ...validData, username: shortUsername };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('short'))).toBe(true);
        });

        it('should reject username longer than max length', async () => {
            const longUsername = 'a'.repeat(USERNAME_MAX_LENGTH + 1);
            const dto = { ...validData, username: longUsername };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('long'))).toBe(true);
        });

        it('should reject username with invalid characters', async () => {
            const invalidNames = ['user name', 'name@', 'wrong!'];
            for (const username of invalidNames) {
                const dto = { ...validData, username };
                const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
                expect(isValid).toBe(false);
                expect(errors.some(e => e.toLowerCase().includes('invalid'))).toBe(true);
            }
        });
    });

    describe('password', () => {
        it('should accept valid password', async () => {
            const dto = { ...validData };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        });

        it('should reject too short password', async () => {
            const dto = { ...validData, password: 'Aa1!' };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('short'))).toBe(true);
        });

        it('should reject password not meeting complexity rules', async () => {
            const invalids = ['password123', 'PASSWORD123', 'NoSpecial1', 'alllowercase!'];
            for (const password of invalids) {
                const dto = { ...validData, password, passwordConfirmation: password };
                const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
                expect(isValid).toBe(false);
                expect(errors.some(e => e.toLowerCase().includes('password'))).toBe(true);
            }
        });
    });

    describe('passwordConfirmation', () => {
        it('should require confirmation field', async () => {
            const dto = { ...validData, passwordConfirmation: undefined };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('confirmation'))).toBe(true);
        });

        it('should reject if confirmation too short', async () => {
            const dto = { ...validData, passwordConfirmation: 'Ab1!' };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('short'))).toBe(true);
        });

        it('should reject if confirmation does not match password', async () => {
            const dto = { ...validData, passwordConfirmation: 'Different123!' };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('match'))).toBe(true);
        });

        it('should accept if confirmation matches password', async () => {
            const dto = { ...validData, passwordConfirmation: validData.password };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        });
    });

    describe('optional fields', () => {
        it('should reject too long bio', async () => {
            const bio = 'a'.repeat(BIO_MAX_LENGTH + 1);
            const dto = { ...validData, bio };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(false);
            expect(errors.some(e => e.toLowerCase().includes('bio'))).toBe(true);
        });
    });

    describe('complete DTO', () => {
        it('should accept valid signup data', async () => {
            const dto = { ...validData };
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, dto);
            expect(isValid).toBe(true);
            expect(errors).toHaveLength(0);
        });

        it('should reject when all fields are missing', async () => {
            const { isValid, errors } = await ValidationTestHelper.validateDto(SignupDto, {});
            expect(isValid).toBe(false);
            expect(errors.length).toBeGreaterThanOrEqual(4);
        });
    });
});
