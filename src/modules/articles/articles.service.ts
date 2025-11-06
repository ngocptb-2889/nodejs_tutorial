import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Tag } from '../tags/entities/tag.entity';
import { ArticleResponseDto } from './dto/article-response.dto';
import { UsersService } from '../users/users.service';
import { ArticleQueryDto } from './dto/article-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/pagination-response.dto';
import { PAGE, PER_PAGE } from 'src/common';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    private readonly userService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  async create(authorId: number, input: CreateArticleDto): Promise<ArticleResponseDto> {
    const author = await this.userService.findById(authorId);
    if (!author) {
      throw new Error(this.i18n.translate('app.user.notFound'));
    }

    const tagEntities = input.tagList?.length
      ? await this.handleTags(input.tagList)
      : [];

    const article = this.articleRepo.create({
      title: input.title,
      description: input.description,
      body: input.body,
      author: author,
      tags: tagEntities,
    });

    const saved = await this.articleRepo.save(article);

    return ArticleResponseDto.fromEntity(saved);
  }

  async update(slug: string, authorId: number, input: Partial<UpdateArticleDto>): Promise<ArticleResponseDto> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new Error(this.i18n.translate('app.article.notFound'));
    }

    if (article.authorId !== authorId) {
      throw new Error(this.i18n.translate('app.validation.permissionDenied'));
    }

    if (input.title) article.title = input.title;
    if (input.description) article.description = input.description;
    if (input.body) article.body = input.body;
    if (input.tagList) {
      const newTags = await this.handleTags(input.tagList);
      article.tags = newTags;
    }

    const updated = await this.articleRepo.save(article);
    return ArticleResponseDto.fromEntity(updated);
  }

  async getArticle(slug: string): Promise<ArticleResponseDto> {
    const article = await this.findBySlug(slug, ['author', 'tags']);
    if (!article) {
      throw new Error(this.i18n.translate('app.article.notFound'));
    }

    return ArticleResponseDto.fromEntity(article);
  }

  async delete(authorId: number, slug: string): Promise<{message: string}> {
    try {
      const article = await this.findBySlug(slug);
      if (!article) {
        throw new Error(this.i18n.translate('app.article.notFound'));
      }

      if (article.author.id !== authorId) {
        throw new Error(this.i18n.translate('app.validation.permissionDenied'));
      }

      await this.articleRepo.delete({ slug });
      return { message: this.i18n.translate('app.message.success.deleteArticle') };
    } catch {
      throw new Error(this.i18n.translate('app.message.error.deleteArticle'));
    }
  }
  
  private async handleTags(tagList: string[]): Promise<Tag[]> {
   const existingTags = await this.tagRepo.find({
      where: { name: In(tagList) },
    });

    const existingNames = existingTags.map((t) => t.name);
    const newTagNames = tagList.filter((n) => !existingNames.includes(n));

    const newTags = newTagNames.map((name) => this.tagRepo.create({ name }));
    if (newTags.length > 0) await this.tagRepo.save(newTags);

    return [...existingTags, ...newTags];
  }

  async findBySlug(slug: string, relations?: Array<string>): Promise<Article | null> {
    return this.articleRepo.findOne({ where: { slug }, relations: relations });
  }

  async getList(query: ArticleQueryDto): Promise<PaginatedResponseDto<ArticleResponseDto>> {
    const qb = this.articleRepo.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags');

    if (query.tags) {
      qb.andWhere('tags.name In(:tagName)', { tagName: query.tags });
    }
    
    if (query.author) {
      qb.andWhere('author.username = :authorName', { authorName: query.author });
    }
    const totalItems = await qb.getCount();

    const page = query.page || PAGE;
    const limit = query.limit || PER_PAGE;
    const offset = query.offset || (page - 1) * limit;

    const articles = await qb
      .orderBy('article.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    const data = articles.map(article => ArticleResponseDto.fromEntity(article));

    const totalPages = Math.ceil(totalItems / limit);

    return new PaginatedResponseDto<ArticleResponseDto>(data, {
      page,
      limit,
      totalItems,
      totalPages
    }); 
  }
}
