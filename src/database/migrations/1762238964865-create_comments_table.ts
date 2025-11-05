import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentsTable1762238964865 implements MigrationInterface {
    name = 'CreateCommentsTable1762238964865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE comments (
                id int NOT NULL AUTO_INCREMENT,
                body text NOT NULL,
                authorId int NOT NULL,
                articleId int NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (id)
            )
        `);

        await queryRunner.query(`
            ALTER TABLE comments
            ADD CONSTRAINT FK_COMMENTS_AUTHOR FOREIGN KEY (authorId)
            REFERENCES users(id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE comments
            ADD CONSTRAINT FK_COMMENTS_ARTICLE
            FOREIGN KEY (articleId) REFERENCES articles(id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE comments`);
    }
}
