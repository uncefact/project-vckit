import { Table, type MigrationInterface, type QueryRunner } from 'typeorm';

/** Publishes witness approvals independently of the log they approve. @public */
export class CreateWebvhWitnessProofTable1700000000003 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'webvh-witness-proof',
      columns: [
        { name: 'scid', type: 'varchar', isPrimary: true },
        { name: 'dids', type: 'text', default: "'[]'" },
        { name: 'proofs', type: 'text', default: "'[]'" },
      ],
    }), true);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('webvh-witness-proof');
  }
}
