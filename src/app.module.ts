import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { dataSourceOptions } from './database/data-source';
import { i18nConfig } from './i18n/i18n-config';
import { ArticlesModule } from './modules/articles/articles.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UserFollowsModule } from './modules/user-follows/user-follows.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => dataSourceOptions,
    }),

    I18nModule.forRoot(i18nConfig),
    UsersModule,
    AuthModule,
    ArticlesModule,
    CommentsModule,
    UserFollowsModule,
  ],
})
export class AppModule {}