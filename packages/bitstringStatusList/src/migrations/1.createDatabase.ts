import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { migrationGetTableName } from './migration-functions.js';

/**
 * Create the database layout for Veramo 3.0
 *
 * @public
 */
export class CreateDatabase1712717811001 implements MigrationInterface {
  name = 'CreateDatabase1712717811001'; // Used in case this class gets minified, which would change the classname

  async up(queryRunner: QueryRunner): Promise<void> {
    const dateTimeType: string = queryRunner.connection.driver.mappedDataTypes
      .createDate as string;

    await queryRunner.createTable(
      new Table({
        name: migrationGetTableName(queryRunner, 'bitstring-status-list'),
        columns: [
          {
            name: 'listIndex',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'lastStatusIndex',
            type: 'integer',
            isNullable: false,
            default: 0,
          },
          {
            name: 'bitstringLength',
            type: 'integer',
            isNullable: false,
            default: 131072,
          },
          { name: 'statusListVCIssuer', type: 'varchar', isNullable: false },
          { name: 'statusPurpose', type: 'varchar', isNullable: false },
          {
            name: 'statusSize',
            type: 'integer',
            isNullable: false,
            default: 1,
          },
          { name: 'statusMessages', type: 'varchar', isNullable: false },
          { name: 'statusListCredential', type: 'varchar', isNullable: true },
          { name: 'verifiableCredential', type: 'varchar', isNullable: true },
          { name: 'statusReference', type: 'varchar', isNullable: true },
        ],
        indices: [
          {
            columnNames: [
              'bitstringLength',
              'statusListVCIssuer',
              'statusPurpose',
              'statusSize',
              'statusMessages',
            ],
            isUnique: true,
          },
          {
            columnNames: ['statusListCredential'],
          },
          {
            columnNames: ['statusListVCIssuer'],
          },
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('illegal_operation: cannot roll back initial migration');
  }
}
