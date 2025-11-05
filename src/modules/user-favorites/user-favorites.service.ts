import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFavorite } from './entities/user-favorite.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ArticlesService } from '../articles/articles.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserFavoritesService {
    constructor(
        @InjectRepository(UserFavorite) private repo: Repository<UserFavorite>,
        private readonly articleService: ArticlesService,
        private readonly i18n: I18nService
    ) {}

    async favoriteArticle(user: User, slug: string): Promise<{ message: string }> {
        const article = await this.articleService.findBySlug(slug);
        if (!article) {
            throw new Error(this.i18n.translate('app.article.notFound'));
        }

        const existingFavorite = await this.repo.findOne({ where: { userId: user.id, articleId: article.id } });
        if (existingFavorite) {
            return {
                message: this.i18n.translate('app.userFavorites.alreadyFavorited'),
            }
        }

        const favorite = this.repo.create({
            userId: user.id,
            articleId: article.id
        });

        await this.repo.save(favorite);

        return {
            message: this.i18n.translate('app.userFavorites.favoritedSuccessfully'),
        }
    }

    async unfavoriteArticle(user: User, slug: string): Promise<{ message: string }> {
        const article = await this.articleService.findBySlug(slug);
        if (!article) {
            throw new Error(this.i18n.translate('app.article.notFound'));
        }

        const existingFavorite = await this.repo.findOne({ where: { userId: user.id, articleId: article.id } });
        if (!existingFavorite) {
            return {
                message: this.i18n.translate('app.userFavorites.notFavorited'),
            }
        }

        await this.repo.delete({ userId: user.id, articleId: article.id });

        return {
            message: this.i18n.translate('app.userFavorites.unfavoritedSuccessfully'),
        }
    }
}
