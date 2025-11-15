import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductStatus1760185169799 implements MigrationInterface {
  name = 'AddProductStatus1760185169799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //         ALTER TABLE \`products\`
    //         ADD COLUMN \`status\` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE'
    //     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`products\` DROP COLUMN \`status\`
        `);
  }
}
