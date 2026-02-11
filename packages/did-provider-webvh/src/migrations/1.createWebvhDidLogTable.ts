import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Creates the webvh-did-log table for storing did:webvh DID logs.
 *
 * @public
 */
export class CreateWebvhDidLogTable1700000000001 implements MigrationInterface {
  name = 'CreateWebvhDidLogTable1700000000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    const dateTimeType: string = queryRunner.connection.driver.mappedDataTypes
      .createDate as string;

    await queryRunner.createTable(
      new Table({
        name: 'webvh-did-log',
        columns: [
          {
            name: 'scid',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'currentDid',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'previousDids',
            type: 'text',
            isNullable: false,
            default: "'[]'",
          },
          {
            name: 'log',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'portable',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'deactivated',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'createdAt',
            type: dateTimeType,
          },
          {
            name: 'updatedAt',
            type: dateTimeType,
          },
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('webvh-did-log', true);
  }
}
