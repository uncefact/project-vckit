import { FunctionComponent, MouseEventHandler } from "react";
import { Download } from "react-feather";
import { Button, ButtonVariant } from "../../UI/Button";
import { QueueState, QueueType } from "../../../constants/QueueState";
import { Network, WrappedDocument } from "../../../types";
import { generateFileName } from "../../../utils";
import { ErrorCard } from "../../UI/ErrorCard";
import { ProcessedDocumentTag } from "../ProcessedDocumentTag";

interface ProcessDocumentContentProps {
  network: Network;
  queueState: QueueState;
  queueType: QueueType;
  failedDocuments: WrappedDocument[];
  pendingDocuments: WrappedDocument[];
  successDocuments: WrappedDocument[];

  fileName: string;

  downloadErrorName: string;
  downloadErrorLink: string;

  downloadAllFn: MouseEventHandler<HTMLButtonElement>;

  processAnotherDocumentFn: MouseEventHandler<HTMLButtonElement>;
}

export const ProcessDocumentContent: FunctionComponent<ProcessDocumentContentProps> = ({
  network,

  queueState,
  queueType,
  failedDocuments,
  pendingDocuments,
  successDocuments,

  fileName,

  downloadErrorName,
  downloadErrorLink,

  downloadAllFn,

  processAnotherDocumentFn,
}) => {
  const isIssuingFlow = queueType === QueueType.ISSUE;

  const isNetworkError = queueState === QueueState.ERROR && failedDocuments.length === 0;
  const isDocumentError = queueState !== QueueState.ERROR && failedDocuments.length > 0;
  const isDocumentSuccess =
    queueState !== QueueState.ERROR && (pendingDocuments.length > 0 || successDocuments.length > 0);

  const ErrorLogButton = () => {
    return (
      <Button className="bg-rose flex mx-auto border-rose hover:bg-rose-400">
        <a className="text-white hover:text-white" download={downloadErrorName} href={downloadErrorLink}>
          Download Error Log
        </a>
      </Button>
    );
  };

  const DownloadAllButton = () => {
    return (
      <Button
        variant={ButtonVariant.OUTLINE_PRIMARY}
        className="bg-white text-cerulean hover:bg-cloud-100"
        data-testid="download-all-button"
        onClick={downloadAllFn}
      >
        <div className="flex">
          <Download />
          <div className="ml-2">Download all</div>
        </div>
      </Button>
    );
  };

  return (
    <div className="pb-6">
      {isDocumentError && (
        <>
          <div className="mb-4 flex-grow py-3" data-testid="total-number-of-documents">
            {failedDocuments.length} document(s) failed
          </div>

          <div className={`${successDocuments.length > 0 ? `pb-8 mb-8 border-b border-cloud-200` : ""}`}>
            <ErrorCard
              title={`The document(s) could not be ${
                isIssuingFlow ? "issued" : "revoked"
              } at this time. Please fix the errors and try again.`}
              description={
                <>
                  {failedDocuments.map((failedDocument, index) => {
                    const failedDocumentFileName =
                      failedDocument.fileName && failedDocument.extension
                        ? generateFileName({
                            network,
                            fileName: failedDocument.fileName,
                            extension: failedDocument.extension,
                            hasTimestamp: false,
                          })
                        : fileName;
                    return <div key={`${failedDocumentFileName}-${index}`}>{failedDocumentFileName}</div>;
                  })}
                </>
              }
              button={<ErrorLogButton />}
            />
          </div>
        </>
      )}
      {isNetworkError && (
        <div>
          <ErrorCard
            title={`The document(s) could not be ${isIssuingFlow ? "issued" : "revoked"} at this time.`}
            description={`Please contact TradeTrust via email or client representative to resolve your issue. Alternatively, please try again.`}
            button={<ErrorLogButton />}
          />
        </div>
      )}
      {isDocumentSuccess && (
        <>
          {isIssuingFlow && (
            <div className="flex-grow py-3" data-testid="total-number-of-documents">
              {successDocuments.length} document(s) issued
            </div>
          )}
          <div className="flex justify-between pb-4 mb-4 mt-4">
            <div>
              {successDocuments.map((doc, index) => (
                <ProcessedDocumentTag doc={doc} key={index} isPending={false} type={queueType} fileName={fileName} />
              ))}
              {pendingDocuments.map((doc, index) => (
                <ProcessedDocumentTag doc={doc} key={index} isPending={true} type={queueType} fileName={fileName} />
              ))}
            </div>
          </div>
        </>
      )}
      {queueState === QueueState.CONFIRMED && (
        <div className="flex items-center justify-center mt-12">
          {isIssuingFlow && <DownloadAllButton />}
          <Button className="ml-5" data-testid="process-another-document-button" onClick={processAnotherDocumentFn}>
            {`${isIssuingFlow ? "Create" : "Revoke"} Another Document`}
          </Button>
        </div>
      )}
    </div>
  );
};
