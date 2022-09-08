import { DocumentStoreFactory } from "@govtechsg/document-store";
import { Wallet } from "ethers";
import { revokeDocumentJob } from "./index";
import { supportsInterface } from "../common/utils";

jest.mock("@govtechsg/document-store");
jest.mock("../common/utils");

const mockDocumentStoreFactoryConnect = DocumentStoreFactory.connect as jest.Mock;
const mockDocumentStoreRevoke = jest.fn();
const mockTxWait = jest.fn();
const mockSupportsInterface = supportsInterface as jest.Mock;

const mockDocumentStore = {
  revoke: mockDocumentStoreRevoke,
};

const mockTransactionReceipt = {
  wait: mockTxWait,
};

const whenDocumentStoreExist = (): void => {
  mockTxWait.mockResolvedValue({
    transactionHash: "TX_HASH",
  });
  mockDocumentStoreRevoke.mockResolvedValue(mockTransactionReceipt);
  mockDocumentStoreFactoryConnect.mockReturnValue(mockDocumentStore);
};

const resetMocks = (mocks: jest.Mock[]): void => mocks.forEach((mock) => mock.mockReset());

const mockWallet = ({ code = "0x1234" } = {}): Wallet =>
  ({ provider: { getCode: () => code, getNetwork: () => ({ name: "ropsten" }) } } as any);

describe("revokeDocumentJob", () => {
  beforeEach(() => {
    resetMocks([mockDocumentStoreFactoryConnect, mockDocumentStoreRevoke, mockTxWait]);
  });

  it("should return transaction hash when revoke succeed", async () => {
    whenDocumentStoreExist();
    const wallet = mockWallet();
    mockSupportsInterface.mockResolvedValueOnce(false);
    const hash = await revokeDocumentJob(
      {
        contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
        documents: [],
        targetHash: "9999",
      },
      wallet
    );

    expect(hash).toBe("TX_HASH");
    expect(mockTxWait).toHaveBeenCalledTimes(1);
    expect(mockDocumentStoreRevoke).toHaveBeenCalledWith("0x9999");
  });

  it("should throw an Error when document store address is not a smart contract", async () => {
    whenDocumentStoreExist();
    const wallet = mockWallet({ code: "0x" });

    await expect(
      revokeDocumentJob(
        {
          contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
          documents: [],
          targetHash: "9999",
        },
        wallet
      )
    ).rejects.toThrow(/Address is not a smart contract/);
  });

  it("should throw an Error when transaction fails", async () => {
    whenDocumentStoreExist();
    mockSupportsInterface.mockResolvedValueOnce(false);
    mockTxWait.mockRejectedValueOnce(new Error("Some error"));
    const wallet = mockWallet();

    await expect(
      revokeDocumentJob(
        {
          contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
          documents: [],
          targetHash: "9999",
        },
        wallet
      )
    ).rejects.toThrow(/Some error/);
  });
});
