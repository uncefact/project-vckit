import { HostActions } from "@govtechsg/decentralized-renderer-react-components";
import { Wallet, Signer } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { OpenAttestationDocument } from "@govtechsg/open-attestation";

export type Network = "homestead" | "ropsten" | "rinkeby" | "local";
export type FormType = "TRANSFERABLE_RECORD" | "VERIFIABLE_DOCUMENT";

export interface TemplateProps {
  id: string;
  label: string;
  type: string;
}

export type TradeTrustErc721EventType = "Transfer" | "Transfer to Wallet" | "Surrender" | "Burnt";

export interface TradeTrustErc721Event {
  eventType: TradeTrustErc721EventType;
  documentOwner: string;
  eventTimestamp?: number;
}

export interface TitleEscrowEvent extends TradeTrustErc721Event {
  beneficiary: string;
  holderChangeEvents: {
    blockNumber: number;
    holder: string;
    timestamp: number;
  }[];
}

export type EndorsementChain = (TradeTrustErc721Event | TitleEscrowEvent)[];

export type Resource = {
  title: string;
  url: string;
  date?: string;
};

export interface PersonaProps {
  personaIndex: number;
  details: Persona;
}

export interface DocumentTypeContentProps {
  documentTypeContent: DocumentTypeContent;
}

export type Persona = {
  image: string;
  jobTitle: string;
  description: string;
  learnMore: {
    title: string;
    startMessage?: string;
    thenSteps?: {
      stepTitle: string;
      icon?: string;
      description: string;
    }[];
    nowSteps?: {
      stepTitle: string;
      icon?: string;
      description: string;
    }[];
    benefits?: { benefitTitle: string; icon: string; description: string }[];
    endMessage: string;
  };
};

export type DocumentTypeContent = {
  type: string;
  description: string;
  examples: string;
  message: string;
  users: Persona[];
};

export enum ContentType {
  BENEFIT = "BENEFIT",
  THEN = "THEN",
  NOW = "NOW",
}

export type Dispatch = (action: HostActions) => void;

// FormTemplate is defined in configuration file
export interface FormTemplate {
  name: string;
  type: FormType;
  defaults: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  attachments?: Attachments;
  headers?: string[];
  uiSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  extension?: string;
  fileName?: string;
}

export interface DocumentStorage {
  apiKey: string;
  url: string;
}

export type AwsKmwSignerOption = {
  type: "AWS_KMS";
  accessKeyId: string;
  region: string;
  kmsKeyId: string;
};

export type EncryptedJsonOption = {
  type: "ENCRYPTED_JSON";
  encryptedJson: string;
};

export type FlowSelectorTypes = "issue" | "revoke";

export type WalletOptions = AwsKmwSignerOption | EncryptedJsonOption;

export interface ConfigFile {
  network: Network;
  wallet: string | WalletOptions;
  forms: FormTemplate[];
  documentStorage?: DocumentStorage;
}

export type ConnectedSigner = Signer & {
  readonly provider: Provider;
  readonly publicKey?: never;
  readonly privateKey?: never;
};

export interface Config {
  network: Network;
  wallet?: Wallet | ConnectedSigner;
  forms: FormTemplate[];
  documentStorage?: DocumentStorage;
}

interface Attachments {
  allow: boolean;
  accept?: string;
}

export interface FileUploadType {
  data: string;
  filename: string;
  type: string;
}

// FormData is used by json-schema-forms internally to track state of a single form
export interface FormData {
  schema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  uiSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  idSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  formData: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  edit?: boolean;
  errors?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  errorSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Ownership {
  beneficiaryAddress: string;
  holderAddress: string;
}

// FormEntry is used to store a form's inputs (from FromData) & metadata
export interface FormEntry {
  fileName: string;
  data: FormData;
  templateIndex: number;
  ownership: Ownership;
  extension: string;
}

export interface SetFormParams {
  data?: FormData;
  updatedOwnership?: Ownership;
  fileName?: string;
}

export interface RawDocument {
  type: FormType;
  contractAddress: string;
  rawDocument: OpenAttestationDocument;
  fileName: string;
  payload: { ownership?: Ownership };
  extension: string;
}

export interface WrappedDocument extends RawDocument {
  wrappedDocument: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface PublishingJob {
  nonce: number; // For transaction ordering
  type: FormType;
  contractAddress: string;
  documents: WrappedDocument[];
  merkleRoot: string;
  payload: { ownership?: Ownership };
}

export interface RevokingJob {
  contractAddress: string;
  targetHash: string;
  documents: WrappedDocument[];
}

export interface FailedJobErrors {
  documents: WrappedDocument[];
  error: Error;
}

export interface FailedJob {
  index: number;
  error: Error;
}

export interface ActionsUrlObject {
  links: { self: { href: string } };
}

export interface QueueNumberResponse {
  id: string;
  key: string;
}

export interface NetworkObject {
  network: {
    chain: string;
    chainId: string;
  };
}

export interface QRCode {
  x: number;
  y: number;
  size: number;
}

export interface Watermark {
  qrCode: QRCode;
}
