import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserFollowsTable1762401761101 implements MigrationInterface {
    name = 'CreateUserFollowsTable1762401761101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE user_follows (
                id int NOT NULL AUTO_INCREMENT,
                followerId int NOT NULL,
                followedId int NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX UQ_follower_followed (followerId, followedId),
                PRIMARY KEY (id)
            )
        `);
        await queryRunner.query(`
            ALTER TABLE user_follows
            ADD CONSTRAINT FK_USER_FOLLOWS_FOLLOWER FOREIGN KEY (followerId) REFERENCES users(id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE user_follows
            ADD CONSTRAINT FK_USER_FOLLOWS_FOLLOWED FOREIGN KEY (followedId) REFERENCES users(id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user_follows`);
    }
}
