import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { I18nService } from 'nestjs-i18n';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment) private repo: Repository<Comment>,
        private readonly articleService: ArticlesService,
        private readonly i18n: I18nService
    ) {}

    async create(user: User, slug: string, input: CreateCommentDto): Promise<CommentResponseDto> {
        const article = await this.articleService.findBySlug(slug);
        if (!article) {
            throw new Error(this.i18n.translate('app.article.notFound'));
        }

        if (article.authorId !== user.id) {
            throw new Error(this.i18n.translate('app.validation.permissionDenied'));
        }

        const comment = this.repo.create({
            body: input.body,
            authorId: user.id,
            articleId: article.id
        });

        const saved = await this.repo.save(comment);

        const commentWithAuthor = await this.repo.findOne({ where: { id: saved.id }, relations: ['author'] });

        return CommentResponseDto.fromEntity(commentWithAuthor);
    }

    async delete(user: User, slug: string, commentId: number): Promise<{ message: string } > {
        try {
            const article = await this.articleService.findBySlug(slug);
            if (!article) {
                throw new Error(this.i18n.translate('app.article.notFound'));
            }

            const comment = await this.repo.findOne({ where: {
                id: commentId,
                authorId: user.id,
                articleId: article.id
            }});

            if (!comment) {
                throw new Error(this.i18n.translate('app.comment.notFound'));
            }

            await this.repo.delete({ id: commentId });

            return { message: this.i18n.translate('app.message.success.deleteComment') };
        } catch {
            throw new Error(this.i18n.translate('app.message.error.deleteComment'));
        }
    }

    async getList(slug: string): Promise<CommentResponseDto[]> {
        const article = await this.articleService.findBySlug(slug);
        if (!article) {
            throw new Error(this.i18n.translate('app.article.notFound'));
        }

        const comments = await this.repo.find({ where: { articleId: article.id }, relations: ['author'] });

        return comments.map(comment => CommentResponseDto.fromEntity(comment));
    }
}
