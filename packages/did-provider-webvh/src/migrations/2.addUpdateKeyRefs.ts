import { TableColumn, type MigrationInterface, type QueryRunner } from 'typeorm';

/** Persists KMS references independently of the DID document's verification keys. @public */
export class AddWebvhUpdateKeyRefs1700000000002 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('webvh-did-log', new TableColumn({ name: 'updateKeyRefs', type: 'text', default: "'{}'" }));
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('webvh-did-log', 'updateKeyRefs');
  }
}
