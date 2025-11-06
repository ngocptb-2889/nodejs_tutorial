import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { MIN_DEFAULT, OFFSET_DEFAULT, PAGE, PER_PAGE } from '../constants/app.constants';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Current page number',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(MIN_DEFAULT)
  page?: number = PAGE;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(MIN_DEFAULT)
  limit?: number = PER_PAGE;

  @ApiPropertyOptional({
    description: 'Offset/skip number of articles (default is 0)',
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(OFFSET_DEFAULT)
  offset?: number = OFFSET_DEFAULT;
}
