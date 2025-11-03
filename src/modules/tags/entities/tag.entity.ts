import { BaseEntity } from 'src/database/base.entity';
import { Entity, Column, ManyToMany } from 'typeorm';
import { Article } from 'src/modules/articles/entities/article.entity';
import { FIELD_LENGTH } from 'src/common';

@Entity("tags")
export class Tag extends BaseEntity {
  @Column({ type: 'varchar', length: FIELD_LENGTH.TAG_NAME_MAX, unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
