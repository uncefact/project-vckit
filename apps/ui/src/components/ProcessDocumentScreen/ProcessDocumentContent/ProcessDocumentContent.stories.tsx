import { FunctionComponent } from "react";
import { ProcessDocumentContent } from ".";
import { QueueState, QueueType } from "../../../constants/QueueState";
import { WrappedDocument } from "../../../types";

export default {
  title: "ProcessDocumentScreen/ProcessDocumentContent",
  component: ProcessDocumentContent,
  parameters: {
    componentSubtitle: "ProcessDocumentContent.",
  },
};

const mockDocs = [
  {
    type: "VERIFIABLE_DOCUMENT",
    contractAddress: "",
    fileName: "COO-TEST-1",
    payload: {},
    rawDocument: {},
    wrappedDocument: { data: "TEST TEST" },
  },
  {
    type: "VERIFIABLE_DOCUMENT",
    contractAddress: "",
    fileName: "COO-TEST-2",
    payload: {},
    rawDocument: {},
    wrappedDocument: { data: "TEST TEST" },
  },
] as WrappedDocument[];

export const IssueSuccess: FunctionComponent = () => {
  return (
    <ProcessDocumentContent
      network={"local"}
      queueState={QueueState.CONFIRMED}
      queueType={QueueType.ISSUE}
      failedDocuments={[]}
      pendingDocuments={[]}
      successDocuments={mockDocs}
      fileName={"file-name-test"}
      downloadErrorName={""}
      downloadErrorLink={""}
      downloadAllFn={() => {}}
      processAnotherDocumentFn={() => {}}
    />
  );
};

export const IssuePending: FunctionComponent = () => {
  return (
    <ProcessDocumentContent
      network={"local"}
      queueState={QueueState.PENDING}
      queueType={QueueType.ISSUE}
      failedDocuments={[]}
      pendingDocuments={[]}
      successDocuments={mockDocs}
      fileName={"file-name-test"}
      downloadErrorName={""}
      downloadErrorLink={""}
      downloadAllFn={() => {}}
      processAnotherDocumentFn={() => {}}
    />
  );
};

export const IssueFailure: FunctionComponent = () => {
  return (
    <ProcessDocumentContent
      network={"local"}
      queueState={QueueState.CONFIRMED}
      queueType={QueueType.ISSUE}
      failedDocuments={mockDocs}
      pendingDocuments={[]}
      successDocuments={[]}
      fileName={"file-name-test"}
      downloadErrorName={""}
      downloadErrorLink={""}
      downloadAllFn={() => {}}
      processAnotherDocumentFn={() => {}}
    />
  );
};

export const IssueSuccessAndFailure: FunctionComponent = () => {
  return (
    <ProcessDocumentContent
      network={"local"}
      queueState={QueueState.CONFIRMED}
      queueType={QueueType.ISSUE}
      failedDocuments={mockDocs}
      pendingDocuments={[]}
      successDocuments={mockDocs}
      fileName={"file-name-test"}
      downloadErrorName={""}
      downloadErrorLink={""}
      downloadAllFn={() => {}}
      processAnotherDocumentFn={() => {}}
    />
  );
};

export const IssueError: FunctionComponent = () => {
  return (
    <ProcessDocumentContent
      network={"local"}
      queueState={QueueState.ERROR}
      queueType={QueueType.ISSUE}
      failedDocuments={[]}
      pendingDocuments={[]}
      successDocuments={[]}
      fileName={"file-name-test"}
      downloadErrorName={""}
      downloadErrorLink={""}
      downloadAllFn={() => {}}
      processAnotherDocumentFn={() => {}}
    />
  );
};
export const RevokeSuccess: FunctionComponent = () => {
  return (
    <ProcessDocumentContent
      network={"local"}
      queueState={QueueState.CONFIRMED}
      queueType={QueueType.REVOKE}
      failedDocuments={[]}
      pendingDocuments={[]}
      successDocuments={mockDocs}
      fileName={"file-name-test"}
      downloadErrorName={""}
      downloadErrorLink={""}
      downloadAllFn={() => {}}
      processAnotherDocumentFn={() => {}}
    />
  );
};

export const RevokeFailure: FunctionComponent = () => {
  return (
    <ProcessDocumentContent
      network={"local"}
      queueState={QueueState.CONFIRMED}
      queueType={QueueType.REVOKE}
      failedDocuments={mockDocs}
      pendingDocuments={[]}
      successDocuments={[]}
      fileName={"file-name-test"}
      downloadErrorName={""}
      downloadErrorLink={""}
      downloadAllFn={() => {}}
      processAnotherDocumentFn={() => {}}
    />
  );
};
