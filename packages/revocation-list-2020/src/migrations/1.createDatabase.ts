import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { migrationGetTableName } from './migration-functions.js';

/**
 * Create the database layout for Veramo 3.0
 *
 * @public
 */
export class CreateDatabase1688974564001 implements MigrationInterface {
  name = 'CreateDatabase1688974564001'; // Used in case this class gets minified, which would change the classname

  async up(queryRunner: QueryRunner): Promise<void> {
    const dateTimeType: string = queryRunner.connection.driver.mappedDataTypes
      .createDate as string;

    await queryRunner.createTable(
      new Table({
        name: migrationGetTableName(queryRunner, 'revocation-data'),
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'revocationListUrlPath', type: 'varchar', isNullable: false },
          { name: 'revocationVCIssuer', type: 'varchar', isNullable: false },
          { name: 'indexCounter', type: 'UNSIGNED INT', isNullable: false },
          { name: 'listCounter', type: 'UNSIGNED INT', isNullable: false },
          { name: 'bitStringLength', type: 'UNSIGNED INT', isNullable: false },
        ],
        indices: [
          {
            columnNames: ['revocationListUrlPath', 'revocationVCIssuer'],
            isUnique: true,
          },
          {
            columnNames: ['revocationListUrlPath'],
          },
          {
            columnNames: ['revocationVCIssuer'],
          },
        ],
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: migrationGetTableName(queryRunner, 'revocation-list'),
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          {
            name: 'revocationListFullUrlPath',
            type: 'varchar',
            isNullable: false,
          },
          { name: 'revocationVCIssuer', type: 'varchar', isNullable: false },
          { name: 'verifiableCredential', type: 'varchar', isNullable: false },
        ],
        indices: [
          {
            columnNames: ['revocationListFullUrlPath', 'revocationVCIssuer'],
            isUnique: true,
          },
          {
            columnNames: ['revocationListFullUrlPath'],
          },
          {
            columnNames: ['revocationVCIssuer'],
          },
        ],
      }),
      true
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('illegal_operation: cannot roll back initial migration');
  }
}
