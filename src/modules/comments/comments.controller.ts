import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('comments')
@Controller('articles/:slug/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}
    
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new comment for an article' })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Comment successfully created',
        type: CommentResponseDto,
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
        @CurrentUser() user: User,
        @Param('slug') slug: string,
        @Body() input: CreateCommentDto
    ): Promise<CommentResponseDto> {
        return this.commentsService.create(user, slug, input);
    }

    @ApiOperation({ summary: 'Delete a comment by ID' })
    @ApiBearerAuth()
    @ApiParam({
        name: 'commentId',
        description: 'ID of the comment to delete',
        example: 123,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Comment successfully deleted',
        schema: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Comment deleted successfully' },
        },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Comment not found',
    })
    @ApiResponse({ 
        status: HttpStatus.UNAUTHORIZED, 
        description: 'Unauthorized - invalid or missing JWT token' 
    })
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    async delete(
        @CurrentUser() user: User,
        @Param('slug') slug: string,
        @Param('id', ParseIntPipe) commentId: number
    ): Promise<{ message: string }> {
        return this.commentsService.delete(user, slug, commentId);
    }

    @ApiOperation({ summary: 'Get all comments for an article' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of comments for the given article',
        type: [CommentResponseDto],
    })
    @Get('/')
    async getList(@Param('slug') slug: string): Promise<CommentResponseDto[]> {
        return this.commentsService.getList(slug);
    }
}
