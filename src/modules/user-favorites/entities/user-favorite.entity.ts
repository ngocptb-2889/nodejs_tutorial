import { BaseEntity } from 'src/database/base.entity';
import { Entity, Column, ManyToOne, Unique, } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Article } from 'src/modules/articles/entities/article.entity';

@Entity("user_favorites")
@Unique(['userId', 'articleId'])
export class UserFavorite extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  articleId: number;

  @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Article, article => article.favorites, { onDelete: 'CASCADE' })
  article: Article;
}
