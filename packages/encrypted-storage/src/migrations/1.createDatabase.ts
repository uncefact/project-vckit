import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { migrationGetTableName } from './migration-functions.js';

/**
 * Create the database layout for Veramo 3.0
 *
 * @public
 */
export class CreateDatabase1688974564000 implements MigrationInterface {
  name = 'CreateDatabase1688974564000'; // Used in case this class gets minified, which would change the classname

  async up(queryRunner: QueryRunner): Promise<void> {
    const dateTimeType: string = queryRunner.connection.driver.mappedDataTypes
      .createDate as string;

    await queryRunner.createTable(
      new Table({
        name: migrationGetTableName(queryRunner, 'encrypted-data'),
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'data', type: 'varchar', isNullable: false },
          { name: 'saveDate', type: dateTimeType },
          { name: 'updateDate', type: dateTimeType },
        ],
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: migrationGetTableName(queryRunner, 'credential-encrypted-data'),
        columns: [
          {
            name: 'credentialHash',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'encryptedDataId',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'decryptedKey',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['encryptedDataId'],
            referencedColumnNames: ['id'],
            referencedTableName: migrationGetTableName(
              queryRunner,
              'encrypted-data'
            ),
          },
          {
            columnNames: ['credentialHash'],
            referencedColumnNames: ['hash'],
            referencedTableName: migrationGetTableName(
              queryRunner,
              'credential'
            ),
          },
        ],
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('illegal_operation: cannot roll back initial migration');
  }
}
