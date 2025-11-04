import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(protected articleService: ArticlesService) {}

  @ApiOperation({ summary: 'Create a new article' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Article data to create',
    type: CreateArticleDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Article successfully created',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - invalid or missing JWT token' 
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async create(
    @CurrentUser() user: any,
    @Body() input: CreateArticleDto
  ): Promise<ArticleResponseDto> {
    return this.articleService.create(user.id, input);
  }

  @ApiOperation({ summary: 'Update an existing article' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article to update',
    type: String,
    example: 'how-to-learn-nestjs-abc123',
  })
  @ApiBody({
    description: 'Updated article data',
    type: CreateArticleDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article successfully updated',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article not found',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - invalid or missing JWT token' 
  })
  @UseGuards(AuthGuard('jwt'))
  @Put('/:slug')
  async update(
    @Param('slug') slug: any,
    @CurrentUser() user: any,
    @Body() input: UpdateArticleDto
  ): Promise<ArticleResponseDto> {
    return this.articleService.update(slug, user.id, input);
  }

  @ApiOperation({ summary: 'Get article details by slug' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'slug',
    description: 'Unique slug of the article',
    type: String,
    example: 'how-to-learn-nestjs-abc123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article found and returned',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article not found',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/:slug')
  getArticle(@Param('slug') slug: any): Promise<ArticleResponseDto> {
    return this.articleService.getArticle(slug);
  }

  @ApiOperation({ summary: 'Delete an article by slug' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'slug',
    description: 'Slug of the article to delete',
    type: String,
    example: 'how-to-learn-nestjs-abc123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Article deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article not found',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - invalid or missing JWT token' 
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:slug')
  delete(
    @Param('slug') slug: any,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    return this.articleService.delete(user.id, slug);
  }
}
