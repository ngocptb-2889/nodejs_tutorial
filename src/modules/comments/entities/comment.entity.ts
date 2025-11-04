import { BaseEntity } from 'src/database/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Article } from 'src/modules/articles/entities/article.entity';

@Entity("comments")
export class Comment extends BaseEntity {
  @Column({ type: 'text' })
  body: string;

  @Column()
  authorId: number;

  @Column()
  articleId: number;

  @ManyToOne(() => User, user => user.comments, { eager: true })
  author: User;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;
}
