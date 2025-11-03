import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticleAndTagsTable1761903476452 implements MigrationInterface {
    name = 'CreateArticleAndTagsTable1761903476452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE tags (
                id int NOT NULL AUTO_INCREMENT,
                name varchar(50) NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX IDX_TAG_NAME (name(50)),
                PRIMARY KEY (id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE articles (
                id int NOT NULL AUTO_INCREMENT,
                slug varchar(255) NOT NULL,
                title varchar(255) NOT NULL,
                description text NOT NULL,
                body text NOT NULL,
                authorId int NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX IDX_ARTICLE_SLUG (slug),
                PRIMARY KEY (id)
            )
        `);

        await queryRunner.query(`
            ALTER TABLE articles
            ADD CONSTRAINT FK_ARTICLES_AUTHOR
            FOREIGN KEY (authorId) REFERENCES users(id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            CREATE TABLE article_tags (
                id int NOT NULL AUTO_INCREMENT,
                article_id int NOT NULL,
                tag_id int NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (id)
            )
        `);

        await queryRunner.query(`
            ALTER TABLE article_tags
            ADD CONSTRAINT FK_ARTICLE_TAGS_ARTICLE 
            FOREIGN KEY (article_id) REFERENCES articles(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE article_tags
            ADD CONSTRAINT FK_ARTICLE_TAGS_TAG 
            FOREIGN KEY (tag_id) REFERENCES tags(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE article_tags DROP FOREIGN KEY FK_ARTICLE_TAGS_TAG`);
        await queryRunner.query(`ALTER TABLE article_tags DROP FOREIGN KEY FK_ARTICLE_TAGS_ARTICLE`);
        await queryRunner.query(`ALTER TABLE articles DROP FOREIGN KEY FK_ARTICLES_AUTHOR`);

        await queryRunner.query(`DROP TABLE article_tags`);
        await queryRunner.query(`DROP TABLE articles`);
        await queryRunner.query(`DROP TABLE tags`);
    }
}
