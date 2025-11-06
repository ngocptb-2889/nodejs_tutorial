import { Controller, Delete, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserFavoritesService } from './user-favorites.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ArticleResponseDto } from '../articles/dto/article-response.dto';

@ApiTags('user favorites')
@Controller('articles/:slug/favorites')
export class UserFavoritesController {
    constructor(private userFavoritesService: UserFavoritesService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Favorite an article' })
    @ApiBody({ type: ArticleResponseDto })
    @ApiParam({
        name: 'slug',
        description: 'Slug of the article to favorite',
        example: 'how-to-use-nestjs',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Article has been added to favorites successfully.',
        type: ArticleResponseDto,
    })
    @ApiResponse({ 
        status: HttpStatus.UNAUTHORIZED, 
        description: 'Unauthorized - invalid or missing JWT token' 
    })
    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    async favoriteArticle(@CurrentUser() user: any, @Param('slug') slug: string): Promise<{ message: string }> {
        return this.userFavoritesService.favoriteArticle(user, slug);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Unfavorite an article' })
    @ApiBody({ type: ArticleResponseDto })
    @ApiParam({
        name: 'slug',
        description: 'Slug of the article to favorite',
        example: 'how-to-use-nestjs',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Article has been removed to favorites successfully.',
        type: ArticleResponseDto,
    })
    @ApiResponse({ 
        status: HttpStatus.UNAUTHORIZED, 
        description: 'Unauthorized - invalid or missing JWT token' 
    })
    @UseGuards(AuthGuard('jwt'))
    @Delete('/')
    async unfavoriteArticle(@CurrentUser() user: any, @Param('slug') slug: string): Promise<{ message: string }> {
        return this.userFavoritesService.unfavoriteArticle(user, slug);
    }
}
