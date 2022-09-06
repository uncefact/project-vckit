import axios from "axios";
import { IdentityProofType } from "../../../../constants";
import { Config, FailedJob, RawDocument } from "../../../../types";
import { getDefaultProvider, Wallet } from "ethers";
import { generateIdAndKey } from "../../../API/storageAPI";
import { getRawDocuments, groupDocumentsIntoJobs } from "./publish";
import { VCKIT_API } from "../../../../appConfig";
import * as PDF from "../../../utils/augmentPDF";
import sampleConfigFile from "./sample-config.json";
import sampleFormattedWithDnsDidV3 from "./sample-formatted-with-dns-did-v3.json";
import sampleFormattedWithDnsDid from "./sample-formatted-with-dns-did.json";
import sampleFormattedWithoutQrUrl from "./sample-formatted-without-qr-url.json";
import sampleFormatted from "./sample-formatted.json";
import sampleForms from "./sample-forms.json";
import SampleFormWithOriginalDocument from "./sample-form-with-original-document.json";
import OriginalDocumentConfigFile from "./original-document-config.json";

const mockAugmentPDF = jest.spyOn(PDF, "augmentPDF");

jest.mock("axios");
jest.mock("../../../../appConfig", () => ({
  VCKIT_DOMAIN: "dvp-test.com",
  PROTOCOL: "http",
  VCKIT_WEBSITE: "http://dvp-test.com",
  VCKIT_API: "http://api.dvp-test.com",
}));

const sampleConfig = {
  ...sampleConfigFile,
  wallet: "FAKE_WALLET" as any,
} as Config;

const OriginalDocumentConfig = {
  ...OriginalDocumentConfigFile,
  wallet: "FAKE_WALLET" as any,
} as Config;

const configWithoutDocumentStorage = {
  ...sampleConfigFile,
  documentStorage: undefined,
  wallet: "FAKE_WALLET" as any,
} as Config;

let failedJobs: FailedJob[] = [];

const mockAxioPost = axios.post as jest.Mock;

const wallet = Wallet.createRandom().connect(getDefaultProvider("ropsten"));

jest.mock("../../../API/storageAPI");
const mockGetQueueNumber = generateIdAndKey as jest.Mock;

describe("getRawDocuments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    failedJobs = [];
  });
  it("should get raw documents with default values", async () => {
    mockGetQueueNumber.mockReturnValue({ data: { id: "123", key: "123" } });
    expect(await getRawDocuments(sampleForms, sampleConfig)).toStrictEqual(sampleFormatted);
  });

  it("should not have any qr url when no documentStorage is present in config file", async () => {
    expect(await getRawDocuments(sampleForms, configWithoutDocumentStorage)).toStrictEqual(sampleFormattedWithoutQrUrl);
  });

  // Need to look into why it's not producing the same pdf with the same inputs
  it("should return a raw document with a augmented PDF", async () => {
    mockAugmentPDF.mockResolvedValueOnce("testPdf" as any);
    const document: any = await getRawDocuments(
      JSON.parse(JSON.stringify(SampleFormWithOriginalDocument)),
      OriginalDocumentConfig
    );
    expect(document[0].rawDocument?.credentialSubject?.originalDocument?.document).toBe(
      `data:application/pdf;base64,${Buffer.from("testPdf").toString("base64")}`
    );
  });

  it("should not create a new reserved storage url if it already exists", async () => {
    await getRawDocuments(JSON.parse(JSON.stringify(SampleFormWithOriginalDocument)), OriginalDocumentConfig);
    expect(mockGetQueueNumber).toBeCalledTimes(0);
  });

  it("should not attempt to embed QRCode if originalDocument property is missing", async () => {
    mockGetQueueNumber.mockReturnValue({ data: { id: "123", key: "123" } });
    expect(await getRawDocuments(sampleForms, sampleConfig)).toStrictEqual(sampleFormatted);
    expect(mockAugmentPDF).toBeCalledTimes(0);
  });
});

describe("groupDocumentsIntoJobs", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should batch transactions accordingly and return the jobs without DNS-DID", async () => {
    const publishingJobs = await groupDocumentsIntoJobs(sampleFormatted as RawDocument[], 0, wallet, failedJobs);

    // One tx with 2 verifiable document
    // Two tx with 1 transferable records each
    expect(publishingJobs).toHaveLength(3);

    expect(publishingJobs[0].contractAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
    expect(publishingJobs[0].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[0].documents).toHaveLength(2);
    expect(publishingJobs[0].nonce).toBe(0);

    expect(publishingJobs[1].contractAddress).toBe("0x10E936e6BA85dC92505760259881167141365821");
    expect(publishingJobs[1].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[1].documents).toHaveLength(1);
    expect(publishingJobs[1].nonce).toBe(1);

    expect(publishingJobs[2].contractAddress).toBe("0x10E936e6BA85dC92505760259881167141365821");
    expect(publishingJobs[2].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[2].documents).toHaveLength(1);
    // Skipped 2 since the previous tx takes 2 transactions
    expect(publishingJobs[2].nonce).toBe(3);
  });

  it("should batch transactions accordingly and return the jobs with DNS-DID", async () => {
    const publishingJobs = await groupDocumentsIntoJobs(
      sampleFormattedWithDnsDid as RawDocument[],
      0,
      wallet,
      failedJobs
    );

    // One tx with 1 verifiable document
    // One tx with 1 verifiable DID document
    // Two tx with 1 transferable records each
    expect(publishingJobs).toHaveLength(4);

    expect(publishingJobs[0].contractAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
    expect(publishingJobs[0].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[0].documents).toHaveLength(1);
    expect(publishingJobs[0].nonce).toBe(0);

    expect(publishingJobs[1].contractAddress).toBe(IdentityProofType.DNSDid);
    expect(publishingJobs[1].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[1].documents).toHaveLength(1);
    expect(publishingJobs[1].nonce).toBe(1);

    expect(publishingJobs[2].contractAddress).toBe("0x10E936e6BA85dC92505760259881167141365821");
    expect(publishingJobs[2].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[2].documents).toHaveLength(1);
    expect(publishingJobs[2].nonce).toBe(2);

    expect(publishingJobs[3].contractAddress).toBe("0x10E936e6BA85dC92505760259881167141365821");
    expect(publishingJobs[3].merkleRoot).toBeTruthy(); // eslint-disable-line jest/no-truthy-falsy
    expect(publishingJobs[3].documents).toHaveLength(1);
    expect(publishingJobs[3].nonce).toBe(4);
  });

  it("should sign a DnsDid document using the backend if wallet is missing", async () => {
    mockAxioPost.mockResolvedValueOnce({ data: { proof: { merkleRoot: "test" } } });
    const { rawDocument } = sampleFormattedWithDnsDidV3[0];
    await groupDocumentsIntoJobs(sampleFormattedWithDnsDidV3 as RawDocument[], 0, undefined, failedJobs);
    expect(mockAxioPost).toHaveBeenCalledWith(
      `${VCKIT_API}/credentials/${encodeURIComponent(rawDocument.issuer.id)}/issue`,
      { credential: rawDocument }
    );
  });

  it("should sign a DnsDid document using the frontend if the wallet exists", async () => {
    mockAxioPost.mockResolvedValueOnce({ data: { proof: { merkleRoot: "test" } } });
    await groupDocumentsIntoJobs(sampleFormattedWithDnsDidV3 as RawDocument[], 0, wallet, failedJobs);
    expect(mockAxioPost).toBeCalledTimes(0);
  });

  it("should add failed DnsDid job to failedJobs list if signing by backend fails", async () => {
    mockAxioPost.mockRejectedValueOnce(new Error());
    await groupDocumentsIntoJobs(sampleFormattedWithDnsDidV3 as RawDocument[], 0, undefined, failedJobs);
    expect(failedJobs).toStrictEqual([{ index: 0, error: new Error("Error signing the document.") }]);
  });
});
