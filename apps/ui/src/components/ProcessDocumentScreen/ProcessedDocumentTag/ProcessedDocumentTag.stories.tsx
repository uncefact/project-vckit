import { FunctionComponent } from "react";
import { WrappedDocument } from "../../../types";
import { ProcessedDocumentTag } from "./ProcessedDocumentTag";
import { QueueType } from "../../../constants/QueueState";

export default {
  title: "ProcessDocumentScreen/ProcessedDocumentTag",
  component: ProcessedDocumentTag,
  parameters: {
    componentSubtitle: "ProcessedDocumentTag.",
  },
};

const mockDoc = {
  type: "VERIFIABLE_DOCUMENT",
  contractAddress: "",
  fileName: "test",
  payload: {},
  rawDocument: {},
  wrappedDocument: { data: "test document" },
} as WrappedDocument;

export const Loading: FunctionComponent = () => {
  return <ProcessedDocumentTag doc={mockDoc} isPending={true} type={QueueType.ISSUE} />;
};

export const Default: FunctionComponent = () => {
  return <ProcessedDocumentTag doc={mockDoc} isPending={false} type={QueueType.ISSUE} />;
};
