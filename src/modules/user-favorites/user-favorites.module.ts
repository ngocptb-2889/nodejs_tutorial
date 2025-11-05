import { Module } from '@nestjs/common';
import { UserFavoritesService } from './user-favorites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFavorite } from './entities/user-favorite.entity';
import { UserFavoritesController } from './user-favorites.controller';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFavorite]),
    ArticlesModule
  ],
  providers: [UserFavoritesService],
  controllers: [UserFavoritesController]
})
export class UserFavoritesModule {}
