import { LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent, ReactElement } from "react";
import { CheckCircle, XCircle } from "react-feather";
import { QueueState, QueueType } from "../../../constants/QueueState";
interface ProcessDocumentTitle {
  queueState: QueueState;
  successfulDocumentsCount: number;
  failedDocumentsCount?: number;
  type: QueueType;
}

export const ProcessDocumentTitle: FunctionComponent<ProcessDocumentTitle> = ({
  queueState,
  successfulDocumentsCount,
  failedDocumentsCount = 0,
  type,
}) => {
  const isIssuingFlow = type === QueueType.ISSUE;

  const titleText = (message: string): ReactElement => {
    return <span data-testid="process-title">{message}</span>;
  };

  const getDisplayTitle = (): ReactElement => {
    switch (queueState) {
      case QueueState.PENDING:
        return (
          <>
            <LoaderSpinner className="mr-2" width="24px" primary="#3B8CC5" />
            {titleText(`${isIssuingFlow ? "Issuing document(s)..." : "Revoking document..."}`)}
          </>
        );

      case QueueState.CONFIRMED:
        if (successfulDocumentsCount > 0 && failedDocumentsCount > 0) {
          return (
            <>
              <CheckCircle className="mr-2 text-emerald h-12 w-12 md:h-auto md:w-auto" />
              {titleText(`Some document(s) ${isIssuingFlow ? "issued" : "revoked"} successfully`)}
            </>
          );
        }

        if (successfulDocumentsCount > 0) {
          return (
            <>
              <CheckCircle className="mr-2 text-emerald h-12 w-12 md:h-auto md:w-auto" />
              {titleText(`${isIssuingFlow ? "Document(s) issued" : "Document revoked"} successfully`)}
            </>
          );
        }

        return (
          <>
            <XCircle className="mr-2 text-rose h-12 w-12 md:h-auto md:w-auto" />
            {titleText(`${isIssuingFlow ? "Document(s) failed to issue" : "Document failed to revoke"}`)}
          </>
        );

      case QueueState.ERROR:
        return (
          <>
            <XCircle className="mr-2 text-rose h-12 w-12 md:h-auto md:w-auto" />
            {titleText(`We have encountered an error`)}
          </>
        );

      case QueueState.INITIALIZED:
      default:
        return titleText(`Please wait while we prepare your ${isIssuingFlow ? "document(s)" : "document"}`);
    }
  };

  return (
    <h3 data-testid="process-document-title" className="flex items-center my-8 border-b border-cloud-200 w-full pb-16">
      {getDisplayTitle()}
    </h3>
  );
};
