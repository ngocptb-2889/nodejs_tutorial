import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class ArticleQueryDto extends PaginationQueryDto{
    @ApiPropertyOptional({
        description: 'Filter articles by tag',
        example: 'nestjs',
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined) return undefined;
        return Array.isArray(value) ? value : [value];
    })
    @IsArray()
    @IsString({ each: true })
    tags?: Array<string>;

    @ApiPropertyOptional({
        description: 'Filter articles by author username',
        example: 'john_doe',
    })
    @IsOptional()
    @IsString()
    author?: string;
}