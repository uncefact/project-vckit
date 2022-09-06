import { FunctionComponent } from "react";
import { WrappedDocument } from "../../../types";
import { ProcessDocumentTitle } from "./ProcessDocumentTitle";
import { QueueState, QueueType } from "../../../constants/QueueState";

export default {
  title: "ProcessDocumentScreen/ProcessDocumentTitle",
  component: ProcessDocumentTitle,
  parameters: {
    componentSubtitle: "ProcessDocumentTitle.",
  },
};

const mockDoc = [
  {
    type: "VERIFIABLE_DOCUMENT",
    contractAddress: "",
    fileName: "test",
    payload: {},
    rawDocument: {},
    wrappedDocument: { data: "test document" },
  },
] as WrappedDocument[];

export const Preparing: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.INITIALIZED}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.ISSUE}
    />
  );
};

export const Publishing: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.PENDING}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.ISSUE}
    />
  );
};

export const DocumentPublishSuccess: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.CONFIRMED}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.ISSUE}
    />
  );
};

export const DocumentPublishedFailed: FunctionComponent = () => {
  return <ProcessDocumentTitle queueState={QueueState.CONFIRMED} successfulDocumentsCount={0} type={QueueType.ISSUE} />;
};

export const Revoking: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.PENDING}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.REVOKE}
    />
  );
};

export const DocumentRevokeSuccess: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle
      queueState={QueueState.CONFIRMED}
      successfulDocumentsCount={mockDoc.length}
      type={QueueType.REVOKE}
    />
  );
};

export const DocumentRevokedFailed: FunctionComponent = () => {
  return (
    <ProcessDocumentTitle queueState={QueueState.CONFIRMED} successfulDocumentsCount={0} type={QueueType.REVOKE} />
  );
};
