import { BaseEntity } from 'src/database/base.entity';
import { USERNAME_MAX_LENGTH } from 'src/common';
import { Entity, Column, OneToMany } from 'typeorm';
import { Article } from 'src/modules/articles/entities/article.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Expose } from 'class-transformer';
import { UserFavorite } from 'src/modules/user-favorites/entities/user-favorite.entity';

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ length: USERNAME_MAX_LENGTH })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'text', nullable: true })
  image: string | null;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[]

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]

  @OneToMany(() => User, user => user.id)
  follower: User[];

  @OneToMany(() => User, user => user.id)
  followed: User[];

  @Expose()
  following?: boolean;

  @OneToMany(() => UserFavorite, (userFavorite) => userFavorite.user)
  favorites: UserFavorite[];
}
