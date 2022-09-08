import {
  wrapDocuments as wrapDocumentsV2,
  __unsafe__use__it__at__your__own__risks__wrapDocuments as wrapDocumentsV3,
  utils,
} from "@govtechsg/open-attestation";
import { defaultsDeep, groupBy } from "lodash";
import Axios from "axios";
import { IdentityProofType } from "../../../../constants";
import {
  ActionsUrlObject,
  Config,
  DocumentStorage,
  FormEntry,
  PublishingJob,
  RawDocument,
  FailedJob,
} from "../../../../types";
import { generateIdAndKey } from "../../../API/storageAPI";
import { encodeQrCode, getDocumentNetwork } from "../../../utils/utils";
import { Signer } from "ethers";
import { publishDnsDidVerifiableDocumentJob } from "../../../../services/publishing";
import { VCKIT_DOMAIN, PROTOCOL, VCKIT_API } from "../../../../appConfig";
import QRCode from "qrcode";
import { augmentPDF } from "../../../utils/augmentPDF";

interface NetworkUrl {
  homestead: string;
  ropsten: string;
  rinkeby: string;
}

export const getReservedStorageUrl = async (
  documentStorage: DocumentStorage,
  network: "homestead" | "ropsten" | "rinkeby"
): Promise<ActionsUrlObject> => {
  const queueNumber = generateIdAndKey();

  const networkUrl = {
    homestead: `${PROTOCOL}://${VCKIT_DOMAIN}/`,
    ropsten: `${PROTOCOL}://dev.${VCKIT_DOMAIN}/`,
    rinkeby: `${PROTOCOL}://rinkeby.${VCKIT_DOMAIN}/`,
  } as NetworkUrl;

  const qrUrlObj = {
    type: "DOCUMENT",
    payload: {
      uri: `${documentStorage.url}/${queueNumber.data.id}`,
      key: queueNumber.data.key,
      permittedActions: ["STORE"],
      redirect: networkUrl[network],
    },
  };

  const qrCodeObject = {
    links: {
      self: {
        href: encodeQrCode(qrUrlObj),
      },
    },
  };

  return qrCodeObject;
};

const getContractAddressFromRawDoc = (document: any) => {
  if (utils.isRawV3Document(document)) {
    return document.openAttestationMetadata.identityProof.type.toString() === IdentityProofType.DNSDid
      ? IdentityProofType.DNSDid
      : document.openAttestationMetadata.proof.value;
  } else {
    return document.issuers[0]?.identityProof?.type === IdentityProofType.DNSDid
      ? IdentityProofType.DNSDid
      : document.issuers[0]?.documentStore || document.issuers[0]?.tokenRegistry;
  }
};

export const getRawDocuments = async (forms: FormEntry[], config: Config): Promise<RawDocument[]> => {
  return Promise.all(
    forms.map(async ({ data, templateIndex, fileName, ownership, extension }) => {
      let qrUrl = data.formData.credentialSubject?.links ? { links: data.formData.credentialSubject?.links } : {};
      if (!data.formData?.credentialSubject?.links) {
        if (config.network !== "local") {
          if (config.documentStorage !== undefined) {
            qrUrl = await getReservedStorageUrl(config.documentStorage, config.network);
          }
        }
      }
      if (
        data.formData.credentialSubject?.originalDocument?.document &&
        qrUrl?.links?.self?.href &&
        data.formData?.watermark
      ) {
        const qr = await QRCode.toDataURL(qrUrl.links.self.href);
        const augmentedOriginalDocument = await augmentPDF(
          data.formData.credentialSubject.originalDocument.document,
          qr,
          data.formData.watermark
        );
        if (augmentedOriginalDocument) {
          data.formData.credentialSubject.originalDocument.document = `data:application/pdf;base64,${Buffer.from(
            augmentedOriginalDocument
          ).toString("base64")}`;
        }
        delete data.formData.watermark;
        delete data.formData.credentialSubject.links;
      }

      const formConfig = config.forms[templateIndex];
      if (!formConfig) throw new Error("Form definition not found");
      const formDefaults = formConfig.defaults;
      const documentNetwork = getDocumentNetwork(config.network);
      let formData;
      if (utils.isRawV3Document(data.formData)) {
        formData = {
          ...data.formData,
          ...documentNetwork,
          credentialSubject: { ...data.formData.credentialSubject, ...qrUrl },
        };
      } else {
        formData = { ...data.formData, ...qrUrl, ...documentNetwork };
      }
      defaultsDeep(formData, formDefaults);
      const contractAddress = getContractAddressFromRawDoc(formData);
      const payload = formConfig.type === "TRANSFERABLE_RECORD" ? { ownership } : {};
      return {
        type: formConfig.type,
        contractAddress,
        rawDocument: formData,
        fileName,
        payload,
        extension,
      };
    })
  );
};

const wrapDocuments = async (rawDocuments: any[]) => {
  return utils.isRawV3Document(rawDocuments[0]) ? await wrapDocumentsV3(rawDocuments) : wrapDocumentsV2(rawDocuments);
};

const processVerifiableDocuments = async (
  nonce: number,
  contractAddress: string,
  verifiableDocuments: RawDocument[]
): Promise<PublishingJob> => {
  const rawOpenAttestationDocuments = verifiableDocuments.map((doc) => doc.rawDocument);

  const wrappedDocuments = await wrapDocuments(rawOpenAttestationDocuments);

  const firstWrappedDocument = wrappedDocuments[0];
  const merkleRoot = utils.getMerkleRoot(firstWrappedDocument);
  const firstRawDocument = verifiableDocuments[0];
  return {
    type: firstRawDocument.type,
    nonce,
    contractAddress,
    documents: verifiableDocuments.map((doc, index) => ({
      ...doc,
      wrappedDocument: wrappedDocuments[index],
    })),
    merkleRoot: merkleRoot,
    payload: {},
  };
};

const TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS = 1;
const TX_NEEDED_FOR_TRANSFERABLE_RECORDS = 2;

// Given a list of documents, create a list of jobs
export const groupDocumentsIntoJobs = async (
  rawDocuments: RawDocument[],
  currentNonce: number,
  signer: Signer | undefined,
  failedJobs: FailedJob[]
): Promise<PublishingJob[]> => {
  const transferableRecords = rawDocuments.filter((doc) => doc.type === "TRANSFERABLE_RECORD");
  const verifiableDocuments = rawDocuments.filter((doc) => doc.type === "VERIFIABLE_DOCUMENT");
  const groupedVerifiableDocuments = groupBy(verifiableDocuments, "contractAddress");
  const verifiableDocumentsWithDocumentStore = { ...groupedVerifiableDocuments };
  delete verifiableDocumentsWithDocumentStore[IdentityProofType.DNSDid];
  const verifiableDocumentsWithDnsDid =
    Object.keys(groupedVerifiableDocuments).indexOf(IdentityProofType.DNSDid) >= 0
      ? [...groupedVerifiableDocuments[IdentityProofType.DNSDid]]
      : [];
  const documentStoreAddresses = Object.keys(verifiableDocumentsWithDocumentStore);

  let nonce = currentNonce;

  const jobs: PublishingJob[] = [];
  const remoteJobs: Record<string, never | PublishingJob> = {};

  // Process all verifiable documents with document store first
  for (const contractAddress of documentStoreAddresses) {
    const verifiableDocumentsV2 = verifiableDocumentsWithDocumentStore[contractAddress].filter((docs) => {
      return utils.isRawV2Document(docs.rawDocument);
    });
    const verifiableDocumentsV3 = verifiableDocumentsWithDocumentStore[contractAddress].filter((docs) => {
      return utils.isRawV3Document(docs.rawDocument);
    });

    if (verifiableDocumentsV2.length > 0) {
      const verifiableDocumentV2Job = await processVerifiableDocuments(nonce, contractAddress, verifiableDocumentsV2);
      jobs.push(verifiableDocumentV2Job);
      nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
    }
    if (verifiableDocumentsV3.length > 0) {
      const verifiableDocumentV3Job = await processVerifiableDocuments(nonce, contractAddress, verifiableDocumentsV3);
      jobs.push(verifiableDocumentV3Job);
      nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
    }
  }
  // Process all verifiable document with DNS-DID next
  if (verifiableDocumentsWithDnsDid.length > 0) {
    const didRawDocuments = verifiableDocumentsWithDnsDid.map((doc) => doc.rawDocument);
    if (signer) {
      const wrappedDnsDidDocuments = await wrapDocuments(didRawDocuments);

      // Sign DNS-DID document here as we preparing the jobs
      const signedDnsDidDocument = await publishDnsDidVerifiableDocumentJob(wrappedDnsDidDocuments, signer);

      jobs.push({
        type: verifiableDocumentsWithDnsDid[0].type,
        nonce,
        contractAddress: IdentityProofType.DNSDid,
        documents: verifiableDocumentsWithDnsDid.map((doc, index) => ({
          ...doc,
          wrappedDocument: signedDnsDidDocument[index],
        })),
        merkleRoot: wrappedDnsDidDocuments[0].signature?.merkleRoot,
        payload: {},
      });
    } else {
      const allDocuments = verifiableDocumentsWithDnsDid.map(async (document, index) => {
        const { rawDocument }: { rawDocument: any } = document;
        try {
          // TODO: Not sure why "Property 'issuer' does not exist on type 'OpenAttestationDocument'" as OpenAttestationDocument === OpenAttestationDocumentV2 | OpenAttestationDocumentV3
          const encodedURL = encodeURIComponent(rawDocument?.issuer?.id ?? "");

          const signedDnsDidDocument = await Axios.post(`${VCKIT_API}/credentials/${encodedURL}/issue`, {
            credential: rawDocument,
          });
          remoteJobs[`${index}`] = {
            type: document.type,
            nonce,
            contractAddress: IdentityProofType.DNSDid,
            documents: [
              {
                ...document,
                wrappedDocument: signedDnsDidDocument.data,
              },
            ],
            merkleRoot: signedDnsDidDocument.data.proof?.merkleRoot,
            payload: {},
          };
        } catch (err: any) {
          remoteJobs[`${index}`] = { documents: [{ ...document, wrappedDocument: "" }] } as any;
          failedJobs.push({ index, error: new Error("Error signing the document.") });
        }
      });
      await Promise.allSettled(allDocuments);
    }
    nonce += TX_NEEDED_FOR_VERIFIABLE_DOCUMENTS;
  }

  // Process all transferable records next
  for (const transferableRecord of transferableRecords) {
    const { type, contractAddress, rawDocument, payload } = transferableRecord;
    const transferableDocuments = await wrapDocuments([rawDocument]);
    const merkleRoot = utils.getMerkleRoot(transferableDocuments[0]);

    jobs.push({
      type,
      nonce,
      contractAddress,
      documents: [{ ...transferableRecord, wrappedDocument: transferableDocuments[0] }],
      merkleRoot: merkleRoot,
      payload,
    });
    nonce += TX_NEEDED_FOR_TRANSFERABLE_RECORDS;
  }

  return [...Object.values(remoteJobs), ...jobs];
};

export const getPublishingJobs = async (
  forms: FormEntry[],
  config: Config,
  nonce: number,
  signer: Signer | undefined,
  failedJobs: FailedJob[]
): Promise<PublishingJob[]> => {
  // Currently works for only multiple verifiable document issuance:
  const rawDocuments = await getRawDocuments(forms, config);
  return groupDocumentsIntoJobs(rawDocuments, nonce, signer, failedJobs);
};
