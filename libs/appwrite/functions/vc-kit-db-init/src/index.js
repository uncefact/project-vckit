module.exports = async function (req, res) {
  const {stringDefaultSize, dbName, projectId, clientUrl, projectAPIKey, bigInt} = require('../config');
  const sdk = require('node-appwrite');
  const DataBase = require('./dataBase');

  const client = new sdk.Client();

  client
    .setEndpoint(clientUrl)
    .setProject(projectId)
    .setKey(
      projectAPIKey
    )
    .setSelfSigned(true);

  const errors = [];

  const collectionNames = [];
  const collectionIds = [];

  const database = new sdk.Databases(client);
  const db = await database.create(sdk.ID.unique(), dbName);
  const dbId = db.$id;

  for (let i = 0; i < DataBase.length; i++) {
    const row = DataBase[i].split(',');
    const collection_name = row[0];
    const column_name = row[1];
    const data_type = row[2];

    let collectionId = '';
    const collectionIndex = collectionNames.indexOf(collection_name);

    if (collectionIndex !== -1) {
      collectionId = collectionIds[collectionIndex];
    } else {
      const collection = await database.createCollection(
        dbId,
        sdk.ID.unique(),
        collection_name
      );
      collectionId = collection.$id;
      collectionIds.push(collectionId);
      collectionNames.push(collection_name);
    }

    switch (data_type) {
      case 'text':
        const size = row.length >= 4 ? row[3] : stringDefaultSize;
        await database.createStringAttribute(
          dbId,
          collectionId,
          column_name,
          size,
          false
        );
        break;
      case 'character varying':
        await database.createStringAttribute(
          dbId,
          collectionId,
          column_name,
          1,
          false
        );
        break;
      case 'timestamp without time zone':
        await database.createDatetimeAttribute(
          dbId,
          collectionId,
          column_name,
          false
        );
        break;
      case 'boolean':
        await database.createBooleanAttribute(
          dbId,
          collectionId,
          column_name,
          false
        );
        break;
      case 'integer':
        await database.createIntegerAttribute(
          dbId,
          collectionId,
          column_name,
          false
        );
        break;
      case 'bigint':
        await database.createIntegerAttribute(
          dbId,
          collectionId,
          column_name,
          false,
          -bigInt,
          bigInt
        );
        break;
      default:
        errors.push(`Unknown data type ${data_type}`);
    }
  }

  res.json({
    errors: errors,
    collectionsCreated: collectionNames
  });
};
