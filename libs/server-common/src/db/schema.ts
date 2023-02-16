import { Entity } from 'dynamodb-onetable';

export const DynamoSchema = {
  version: '0.0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
    gs1: {
      hash: 'gs1pk',
      sort: 'gs1sk',
    },
  },
  models: {
    Document: {
      pk: { type: String, value: 'Abn#${abn}' },
      sk: { type: String, value: 'Document#${id}' },
      id: { type: String, required: true },
      createdBy: { type: String, required: true },
      abn: { type: String, required: true },
      s3Path: { type: String, required: true },
      decryptionKey: { type: String, required: true },

      gs1pk: { type: String, value: 'Document' },
      gs1sk: { type: String, value: 'Document#${id}' },

      documentNumber: { type: String },
      freeTradeAgreement: { type: String },
      importingJurisdiction: { type: String },
      exporterOrManufacturerAbn: { type: String },
      importerName: { type: String },
      consignmentReferenceNumber: { type: String },
      documentDeclaration: { type: Boolean },
    },
    RevocationCounter: {
      pk: { type: String, value: 'RevocationCounter' },
      sk: { type: String, value: 'RevocationCounter' },
      path: { type: String, required: true },
      counter: { type: Number, required: true },
    },
    DocumentSchema: {
      pk: { type: String, value: 'DocumentSchema' },
      sk: { type: String, value: 'DocumentSchema#${name}#${type}' },
      name: { type: String, required: true },
      type: { type: String, required: true, enum: ['full', 'partial'] },
      schemaPath: { type: String },
      uiSchemaPath: { type: String },
    },
  } as const,
  params: {
    isoDates: true,
    timestamps: true,
  },
};

export type DocumentType = Entity<typeof DynamoSchema.models.Document>;
export type RevocationType = Entity<
  typeof DynamoSchema.models.RevocationCounter
>;
export type DocumentSchemaType = Entity<
  typeof DynamoSchema.models.DocumentSchema
>;
