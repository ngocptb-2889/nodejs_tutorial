import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFollow } from './entities/user-follow.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { I18nService } from 'nestjs-i18n';
import { UserProfileDto } from '../users/dto/user-profile.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserFollowsService {
    constructor(
        @InjectRepository(UserFollow) private repo: Repository<UserFollow>,
        private readonly userService: UsersService,
        private readonly i18n: I18nService
    ) {}

    async followUser(user: User, username: string) : Promise<UserProfileDto> {
        const toFollow = await this.userService.findBy('username', username);
        if (!toFollow) {
            throw new Error(this.i18n.translate('app.user.notFound'));
        }

        if (toFollow.id === user.id) {
            throw new Error(this.i18n.translate('app.user.cannotFollowYourself'));
        }

        let userFollow = await this.repo.findOne({where: { followerId: user.id, followedId: toFollow.id}});

        if (!userFollow) {
            userFollow = this.repo.create({
                followerId: user.id,
                followedId: toFollow.id,
            });
            await this.repo.save(userFollow);
        }

        toFollow.following = true;

        return UserProfileDto.fromEntity(toFollow);
    }

    async unfollowUser(user: User, username: string) : Promise<UserProfileDto> {
        const toUnfollow = await this.userService.findBy('username', username);
        if (!toUnfollow) {
            throw new Error(this.i18n.translate('app.user.notFound'));
        }

        if (toUnfollow.id === user.id) {
            throw new Error(this.i18n.translate('app.user.cannotFollowYourself'));
        }

        const userFollow = await this.repo.findOne({ where: { followerId: user.id, followedId: toUnfollow.id }});

        if (userFollow) {
            await this.repo.remove(userFollow);
        }

        toUnfollow.following = false;

        return UserProfileDto.fromEntity(toUnfollow);
    }
}
