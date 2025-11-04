import { BaseEntity } from 'src/database/base.entity';
import { Entity, Column, ManyToOne, JoinTable, ManyToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { toSlug } from 'src/common/utils/string.utils';
import { FIELD_LENGTH } from 'src/common';

@Entity("articles")
export class Article extends BaseEntity {
  @Column({ type: 'varchar', length: FIELD_LENGTH.SLUG_MAX, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: FIELD_LENGTH.TITLE_MAX })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  body: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User, user => user.articles, { eager: true })
  author: User;

  @ManyToMany(() => Tag, (tag) => tag.articles, { eager: true },)
  @JoinTable({
    name: "article_tags",
    joinColumn: { name: "article_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags: Tag[];

  // Auto generate slug from title
  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.title && !this.slug) {
      const timestamp = Date.now().toString(36);
      const baseSlug = toSlug(this.title);

      const maxBaseLength = FIELD_LENGTH.SLUG_MAX - timestamp.length - 1;
      
      const truncatedSlug = baseSlug.length > maxBaseLength 
        ? baseSlug.substring(0, maxBaseLength)
        : baseSlug;

      this.slug = `${truncatedSlug}-${timestamp}`;
    }
  }
}
