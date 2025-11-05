import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserFavoritesTable1762327457110 implements MigrationInterface {
    name = 'CreateUserFavoritesTable1762327457110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE user_favorites (
                id int NOT NULL AUTO_INCREMENT,
                userId int NOT NULL,
                articleId int NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX UQ_user_favorites_user_article (userId, articleId),
                PRIMARY KEY (id)
            )`
        );
        await queryRunner.query(`
            ALTER TABLE user_favorites
            ADD CONSTRAINT FK_USER_FAVORITES_USER FOREIGN KEY (userId) REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE user_favorites
            ADD CONSTRAINT FK_USER_FAVORITES_ARTICLE FOREIGN KEY (articleId) REFERENCES articles(id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user_favorites`);
    }
}
