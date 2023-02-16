import { Table } from 'dynamodb-onetable';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { DynamoSchema } from './schema';

/*
  Single-table schema and setup.
*/
export const initializeDynamoDataTable = (
  dynamoClient: Dynamo,
  tableName: string
) => {
  const table = new Table({
    name: tableName,
    client: dynamoClient,
    logger: true,
    partial: false,

    schema: DynamoSchema,
  });

  return {
    Document: table.getModel('Document'),
    RevocationCounter: table.getModel('RevocationCounter'),
    DocumentSchema: table.getModel('DocumentSchema'),
  };
};
