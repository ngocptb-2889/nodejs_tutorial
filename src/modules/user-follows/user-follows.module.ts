import { Module } from '@nestjs/common';
import { UserFollowsController } from './user-follows.controller';
import { UserFollowsService } from './user-follows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFollow } from './entities/user-follow.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFollow]),
    UsersModule
  ],
  controllers: [UserFollowsController],
  providers: [UserFollowsService]
})
export class UserFollowsModule {}
