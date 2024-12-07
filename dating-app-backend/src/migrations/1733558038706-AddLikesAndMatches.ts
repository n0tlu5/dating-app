import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLikesAndMatches1733558038706 implements MigrationInterface {
    name = 'AddLikesAndMatches1733558038706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "like" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userFromId" integer, "userToId" integer, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "match" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "user1Id" integer, "user2Id" integer, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_77e0d47be0f67659efee32ce15c" FOREIGN KEY ("userFromId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_3bba41ce1cfd3856a6c90b4148f" FOREIGN KEY ("userToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_e5807dbf41b96d2aef0d41290fe" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_2550e16fe2ff723ababb154f66b" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_2550e16fe2ff723ababb154f66b"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_e5807dbf41b96d2aef0d41290fe"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_3bba41ce1cfd3856a6c90b4148f"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_77e0d47be0f67659efee32ce15c"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "like"`);
    }

}
