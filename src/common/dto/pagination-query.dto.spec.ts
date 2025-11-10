import { NumberValidationTestHelper, ValidationTestHelper } from "../test/validation.helper";
import { PaginationQueryDto } from "./pagination-query.dto";

describe('PaginationQueryDto', () => {
  describe('page', () => {
    NumberValidationTestHelper.validateNumberConstraints(PaginationQueryDto, {}, 'page', 1, false);
  });

  describe('limit', () => {
    NumberValidationTestHelper.validateNumberConstraints(PaginationQueryDto, {}, 'limit', 1, false);
  });

  describe('offset', () => {
    NumberValidationTestHelper.validateNumberConstraints(PaginationQueryDto, {}, 'offset', 0, false);
  });

  describe('complete DTO', () => {
    it('should accept valid pagination data', async () => {
      const dto = { page: 3, limit: 15, offset: 1 };
      const { isValid, errors } = await ValidationTestHelper.validateDto(PaginationQueryDto, dto);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });
    
    it('should reject invalid pagination data', async () => {
      const dto = { page: -1, limit: 0 };
      const { isValid, errors } = await ValidationTestHelper.validateDto(PaginationQueryDto, dto);
      expect(isValid).toBe(false);
      expect(errors.length).toBeGreaterThanOrEqual(2);
      expect(errors.some(e => e.toLowerCase().includes('page'))).toBe(true);
      expect(errors.some(e => e.toLowerCase().includes('limit'))).toBe(true);
    });
  });
});