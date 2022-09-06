import { ProgressBar } from "@govtechsg/tradetrust-ui-components";
import { Wrapper } from "../UI/Wrapper";
import { FunctionComponent, useEffect } from "react";
import { Config, FormEntry } from "../../types";
import { QueueType } from "../../constants/QueueState";
import { useQueue } from "../../common/hooks/useQueue";
import { generateFileName, generateZipFile } from "../../utils";
import { ProcessDocumentTitle } from "./ProcessDocumentTitle";
import { Card } from "../UI/Card";
import { ContentFrame } from "../UI/ContentFrame";
import { ProcessDocumentContent } from "./ProcessDocumentContent";
import { IssueOrRevokeSelector } from "../UI/IssueOrRevokeSelector";

interface ProcessDocumentScreen {
  config: Config;
  processAnotherDocument: () => void;
  forms?: FormEntry[];
  revokeDocuments?: any[];
  fileName?: string;
  type: QueueType;
}

export const ProcessDocumentScreen: FunctionComponent<ProcessDocumentScreen> = ({
  config,
  processAnotherDocument,
  forms,
  revokeDocuments,
  fileName,
  type,
}) => {
  const isIssuingFlow = type === QueueType.ISSUE;

  const useQueueParameters = isIssuingFlow ? { config, formEntries: forms } : { config, documents: revokeDocuments };

  const {
    processDocuments,
    queueState,
    successfulProcessedDocuments,
    failedProcessedDocuments,
    pendingProcessDocuments,
  } = useQueue(useQueueParameters);

  useEffect(() => {
    processDocuments(type);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const failPublishedDocuments = failedProcessedDocuments.map((failedJob) => failedJob.documents).flat();

  const formattedErrorLog = failedProcessedDocuments.map((failedJob) => {
    const fileNames = failedJob.documents.map((document) => document.fileName).join(", ");
    return {
      files: fileNames,
      error: failedJob.error,
    };
  });

  return (
    <Wrapper>
      <div className="mb-4">
        <IssueOrRevokeSelector activeType={isIssuingFlow ? "issue" : "revoke"} />
      </div>
      <ContentFrame>
        <Card>
          <ProgressBar step={3} totalSteps={3} />
          <div className="flex justify-between items-end" data-testid="processing-screen">
            <ProcessDocumentTitle
              queueState={queueState}
              successfulDocumentsCount={successfulProcessedDocuments.length}
              failedDocumentsCount={failedProcessedDocuments.length}
              type={type}
            />
          </div>
          <ProcessDocumentContent
            network={config?.network}
            queueState={queueState}
            queueType={type}
            failedDocuments={failPublishedDocuments}
            pendingDocuments={pendingProcessDocuments}
            successDocuments={successfulProcessedDocuments}
            fileName={fileName || ""}
            downloadErrorName={generateFileName({
              network: config?.network,
              fileName: "error-log",
              extension: "txt",
              hasTimestamp: true,
            })}
            downloadErrorLink={`data:text/plain;charset=UTF-8,${JSON.stringify(formattedErrorLog, null, 2)}`}
            downloadAllFn={() => {
              generateZipFile(successfulProcessedDocuments, config?.network);
            }}
            processAnotherDocumentFn={processAnotherDocument}
          />
        </Card>
      </ContentFrame>
    </Wrapper>
  );
};
