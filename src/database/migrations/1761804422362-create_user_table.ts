import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1761804422362 implements MigrationInterface {
    name = 'CreateUserTable1761804422362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id int NOT NULL AUTO_INCREMENT,
                email varchar(255) NOT NULL,
                username varchar(30) NOT NULL,
                password varchar(255) NOT NULL,
                bio text NULL,
                image text NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX IDX_EMAIL (email),
                PRIMARY KEY (id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE users`);
    }
}
