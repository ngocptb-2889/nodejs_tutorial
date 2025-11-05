import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class ArticleQueryDto extends PaginationQueryDto{
    @ApiPropertyOptional({
        description: 'Filter articles by tag',
        example: 'nestjs',
    })
    @IsOptional()
    @IsArray()
    tags?: Array<string>;

    @ApiPropertyOptional({
        description: 'Filter articles by author username',
        example: 'john_doe',
    })
    @IsOptional()
    @IsString()
    author?: string;
}