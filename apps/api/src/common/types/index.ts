export interface StorageApiConfig {
  bucketName: string;
  s3: {
    region: string;
    s3ForcePathStyle?: boolean;
    accessKeyId?: string;
    secretAccessKey?: string;
    endpoint?: AWS.Endpoint;
  };
}

export interface CommonConfig {
  databaseEndpoint: string;
  connectionOptions: {
    tlsCaFile?: string;
    serverSelectionTimeoutMS: number;
  };
}

export interface ConfigFileApiConfig {
  collectionName: string;
}

export interface VcApiConfig {
  issuerKeyCollectionName: string;
  awsRegion: string;
  kmsCustomerMasterKeyId: string;
}

export interface ApiConfigFile
  extends CommonConfig,
    ConfigFileApiConfig,
    StorageApiConfig,
    VcApiConfig {}

export type ErrorResponse = {
  error: {
    code: number;
    message: string;
    errors?: string[];
  };
};

export type SuccessfulResponse = {
  data: Record<string, unknown>;
};

export type LambdaResponse = (
  responseBody: SuccessfulResponse | ErrorResponse,
  statusCode: number
) => {
  statusCode: number;
  body: string;
};

export type JsonSchema = {
  definitions?: Record<string, unknown>;
  $schema?: string;
  $id?: string;
  title?: string;
  type: string;
  required: string[];
  properties: Record<string, unknown>;
  additionalProperties: boolean;
};
