import { useState } from "react";
import { IdentityProofType } from "../../../constants";
import { QueueState, QueueType } from "../../../constants/QueueState";
import { publishJob } from "../../../services/publishing";
import { revokeDocumentJob } from "../../../services/revoking";
import {
  Config,
  FailedJobErrors,
  FailedJob,
  FormEntry,
  PublishingJob,
  RevokingJob,
  WrappedDocument,
} from "../../../types";
import { getLogger } from "../../../utils/logger";
import { uploadToStorage } from "../../API/storageAPI";
import { getRevokingJobs } from "./utils/revoke";
import { getPublishingJobs } from "./utils/publish";

const { stack } = getLogger("useQueue");

interface UseQueue {
  config: Config;
  formEntries?: FormEntry[];
  documents?: any[];
}

export const useQueue = ({
  config,
  formEntries,
  documents,
}: UseQueue): {
  error?: Error;
  queueState: QueueState;
  processDocuments: (queueType: QueueType) => void;
  successfulProcessedDocuments: WrappedDocument[];
  failedProcessedDocuments: FailedJobErrors[];
  pendingProcessDocuments: WrappedDocument[];
} => {
  const [error, setError] = useState<Error>();
  const [queueState, setQueueState] = useState<QueueState>(QueueState.UNINITIALIZED);
  const [jobs, setJobs] = useState<PublishingJob[] | RevokingJob[]>([]);
  const [completedJobIndex, setCompletedJobIndex] = useState<number[]>([]);
  const [failedJob, setFailedJob] = useState<FailedJob[]>([]);
  const [pendingJobIndex, setPendingJobIndex] = useState<number[]>([]);

  const successfulProcessedDocuments = completedJobIndex.reduce(
    (acc, curr) => [...acc, ...jobs[curr].documents],
    [] as WrappedDocument[]
  );

  const failedProcessedDocuments = failedJob.map((job) => {
    return {
      documents: jobs[job.index].documents,
      error: job.error,
    };
  });

  const pendingProcessDocuments = pendingJobIndex.reduce(
    (acc, curr) => [...acc, ...jobs[curr].documents],
    [] as WrappedDocument[]
  );

  const processDocuments = async (queueType: QueueType): Promise<void> => {
    // Cannot use setCompletedJobIndex here as async update does not with the promise race
    const completedJobsIndexes: number[] = [];
    const failedJobs: FailedJob[] = [];
    setQueueState(QueueState.INITIALIZED);
    const wallet = config?.wallet;
    try {
      const nonce = wallet ? await wallet.getTransactionCount() : 0;
      const processingJobs =
        queueType === QueueType.ISSUE
          ? await getPublishingJobs(formEntries as FormEntry[], config, nonce, wallet, failedJobs)
          : await getRevokingJobs(documents as any[]);

      setJobs(processingJobs);
      const pendingJobs = new Set(processingJobs.map((job, index) => index));
      setPendingJobIndex(Array.from(pendingJobs));
      setQueueState(QueueState.PENDING);

      const failedJobsIndex = failedJobs.map((failedjob) => failedjob.index);

      const allJobs = processingJobs.map(async (job, index) => {
        if (!failedJobsIndex.includes(index)) {
          try {
            if (queueType === QueueType.ISSUE) {
              if (job.contractAddress !== IdentityProofType.DNSDid && wallet) {
                // publish verifiable documents and transferable records with doc store and token registry
                await publishJob(job as PublishingJob, wallet);
              }
              // upload all the docs to document storage
              const uploadDocuments = job.documents.map(async (doc) => {
                if (config.documentStorage === undefined) return;
                await uploadToStorage(doc, config.documentStorage);
              });
              await Promise.all(uploadDocuments);
              completedJobsIndexes.push(index);
              setCompletedJobIndex(completedJobsIndexes);
            } else if (queueType === QueueType.REVOKE && wallet) {
              await revokeDocumentJob(job as RevokingJob, wallet);
              completedJobsIndexes.push(index);
              setCompletedJobIndex(completedJobsIndexes);
            }
          } catch (e) {
            if (e instanceof Error) {
              failedJobs.push({
                index: index,
                error: e,
              });
              setFailedJob(failedJobs);
              stack(e);
              throw e;
            }
          } finally {
            pendingJobs.delete(index);
            setPendingJobIndex(Array.from(pendingJobs));
          }
        } else {
          pendingJobs.delete(index);
          setPendingJobIndex(Array.from(pendingJobs));
        }
      });
      await Promise.allSettled(allJobs);
      setCompletedJobIndex(completedJobsIndexes);
      setFailedJob(failedJobs);
      setQueueState(QueueState.CONFIRMED);
    } catch (e) {
      if (e instanceof Error) {
        stack(e);
        setError(e);
        setQueueState(QueueState.ERROR);
      }
    }
  };

  return {
    processDocuments,
    queueState,
    error,
    successfulProcessedDocuments,
    failedProcessedDocuments,
    pendingProcessDocuments,
  };
};
