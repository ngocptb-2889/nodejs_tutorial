import { Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserFollowsService } from './user-follows.service';
import { UsersService } from '../users/users.service';
import { UserProfileDto } from '../users/dto/user-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('user follows')
@Controller('profiles/:username')
export class UserFollowsController {
    constructor(
        private readonly userService: UsersService,
        private readonly userFollowService: UserFollowsService
    ) {}

    @ApiOperation({ summary: 'Get user profile' })
    @ApiParam({
        name: 'username',
        description: 'username of the user to get profile',
        example: 'jonedoe',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user profile has been successfully retrieved.',
        type: UserProfileDto,
    })
    @Get('/')
    getProfile(@Param('username') username: string): Promise<UserProfileDto> {
        return this.userService.getProfile(username);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Follow other user' })
    @ApiBody({ type: UserProfileDto })
    @ApiParam({
        name: 'username',
        description: 'username of the user to follow',
        example: 'jonedoe',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Follow successfully.',
        type: UserProfileDto,
    })
    @ApiResponse({ 
        status: HttpStatus.UNAUTHORIZED, 
        description: 'Unauthorized - invalid or missing JWT token' 
    })
    @UseGuards(AuthGuard('jwt'))
    @Post('/follow')
    followUser(
        @CurrentUser() user: User,
        @Param('username') username: string
    ): Promise<UserProfileDto> {
        return this.userFollowService.followUser(user, username);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Unfollow other user' })
    @ApiBody({ type: UserProfileDto })
    @ApiParam({
        name: 'username',
        description: 'username of the user to follow',
        example: 'jonedoe',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Unfollow successfully.',
        type: UserProfileDto,
    })
    @ApiResponse({ 
        status: HttpStatus.UNAUTHORIZED, 
        description: 'Unauthorized - invalid or missing JWT token' 
    })
    @UseGuards(AuthGuard('jwt'))
    @Post('/unfollow')
    unfollowUser(
        @CurrentUser() user: User,
        @Param('username') username: string
    ): Promise<UserProfileDto> {
        return this.userFollowService.unfollowUser(user, username);
    }
}
