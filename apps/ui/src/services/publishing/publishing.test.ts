import { DocumentStoreFactory } from "@govtechsg/document-store";
import { TitleEscrowCreatorFactory, TradeTrustErc721Factory } from "@govtechsg/token-registry";
import { getDefaultProvider, Wallet } from "ethers";
import { getTitleEscrowCreator, publishTransferableRecordJob, publishVerifiableDocumentJob } from "./index";
import { supportsInterface } from "../common/utils";

jest.mock("@govtechsg/token-registry");
jest.mock("@govtechsg/document-store");
jest.mock("../common/utils");

const mockTitleEscrowCreatorFactoryConnect = TitleEscrowCreatorFactory.connect as jest.Mock;
const mockDocumentStoreFactoryConnect = DocumentStoreFactory.connect as jest.Mock;
const mockTradeTrustErc721FactoryConnect = TradeTrustErc721Factory.connect as jest.Mock;
const mockDocumentStoreIssue = jest.fn();
const mockTokenRegistrySafeMint = jest.fn();
const mockTitleEscrowDeployNewTitleEscrow = jest.fn();
const mockTxWait = jest.fn();
const mockSupportsInterface = supportsInterface as jest.Mock;

const mockDocumentStore = {
  issue: mockDocumentStoreIssue,
};

const mockTokenRegistry = {
  "safeMint(address,uint256)": mockTokenRegistrySafeMint,
};
const mockTitleEscrowCreator = {
  deployNewTitleEscrow: mockTitleEscrowDeployNewTitleEscrow,
};

const mockTransactionReceipt = {
  wait: mockTxWait,
};

const whenDocumentStoreExist = (): void => {
  mockTxWait.mockResolvedValue({
    transactionHash: "TX_HASH",
  });
  mockDocumentStoreIssue.mockResolvedValue(mockTransactionReceipt);
  mockDocumentStoreFactoryConnect.mockReturnValue(mockDocumentStore);
};

const whenTokenRegistryExist = (): void => {
  mockTxWait.mockResolvedValue({
    transactionHash: "TX_HASH",
    events: [{ event: "TitleEscrowDeployed", args: ["0x7777"] }],
  });
  mockTokenRegistrySafeMint.mockResolvedValue(mockTransactionReceipt);
  mockTitleEscrowDeployNewTitleEscrow.mockResolvedValue(mockTransactionReceipt);
  mockTitleEscrowCreatorFactoryConnect.mockReturnValue(mockTitleEscrowCreator);
  mockTradeTrustErc721FactoryConnect.mockReturnValue(mockTokenRegistry);
};

const resetMocks = (mocks: jest.Mock[]): void => mocks.forEach((mock) => mock.mockReset());

const mockWallet = ({ code = "0x1234" } = {}): Wallet =>
  ({ provider: { getCode: () => code, getNetwork: () => ({ name: "ropsten" }) } } as any);
const randomWallet = (network = "ropsten"): Wallet => Wallet.createRandom().connect(getDefaultProvider(network));

describe("publishing", () => {
  beforeEach(() => {
    resetMocks([
      mockTitleEscrowCreatorFactoryConnect,
      mockDocumentStoreFactoryConnect,
      mockDocumentStoreIssue,
      mockTxWait,
    ]);
  });

  describe("getTitleEscrowCreator", () => {
    it("should return instance of TitleEscrowCreator for a network with deployed creator contract", async () => {
      mockTitleEscrowCreatorFactoryConnect.mockResolvedValue("MOCK_TITLE_ESCROW_FACTORY");
      const wallet = randomWallet();
      const titleEscrowCreator = await getTitleEscrowCreator(wallet);

      expect(mockTitleEscrowCreatorFactoryConnect).toHaveBeenCalledWith(
        "0xB0dE5E22bAc12820b6dbF6f63287B1ec44026c83",
        wallet
      );
      expect(titleEscrowCreator).toBe("MOCK_TITLE_ESCROW_FACTORY");
    });

    it("should throw on network without creator contract", async () => {
      mockTitleEscrowCreatorFactoryConnect.mockResolvedValue("MOCK_TITLE_ESCROW_FACTORY");
      const wallet = randomWallet("kovan");
      await expect(getTitleEscrowCreator(wallet)).rejects.toThrow(
        /Title escrow contract creator is not declared for kovan network/
      );
    });
  });

  describe("publishVerifiableDocumentJob", () => {
    it("should return transaction hash when publishing succeed", async () => {
      whenDocumentStoreExist();
      const wallet = mockWallet();
      mockSupportsInterface.mockResolvedValueOnce(false);
      const hash = await publishVerifiableDocumentJob(
        {
          nonce: 1234,
          type: "VERIFIABLE_DOCUMENT",
          contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
          documents: [],
          merkleRoot: "9999",
          payload: {},
        },
        wallet
      );

      expect(hash).toBe("TX_HASH");
      expect(mockTxWait).toHaveBeenCalledTimes(1);
      expect(mockDocumentStoreIssue).toHaveBeenCalledWith("0x9999", { nonce: 1234 });
    });

    it("should throw when document store address is not a smart contract", async () => {
      whenDocumentStoreExist();
      const wallet = mockWallet({ code: "0x" });

      await expect(
        publishVerifiableDocumentJob(
          {
            nonce: 1234,
            type: "VERIFIABLE_DOCUMENT",
            contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
            documents: [],
            merkleRoot: "9999",
            payload: {},
          },
          wallet
        )
      ).rejects.toThrow(/Address is not a smart contract/);
    });

    it("should throw when transaction fails", async () => {
      whenDocumentStoreExist();
      mockSupportsInterface.mockResolvedValueOnce(false);
      mockTxWait.mockRejectedValueOnce(new Error("Some error"));
      const wallet = mockWallet();

      await expect(
        publishVerifiableDocumentJob(
          {
            nonce: 1234,
            type: "VERIFIABLE_DOCUMENT",
            contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
            documents: [],
            merkleRoot: "9999",
            payload: {},
          },
          wallet
        )
      ).rejects.toThrow(/Some error/);
    });
  });

  describe("publishTransferableRecordJob", () => {
    it("should deploy title escrow with the first transaction", async () => {
      whenTokenRegistryExist();
      const wallet = mockWallet();

      const hash = await publishTransferableRecordJob(
        {
          nonce: 1234,
          type: "TRANSFERABLE_RECORD",
          contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
          documents: [],
          merkleRoot: "9999",
          payload: {
            ownership: {
              beneficiaryAddress: "0x1111",
              holderAddress: "0x2222",
            },
          },
        },
        wallet
      );

      expect(hash).toBe("TX_HASH");
      expect(mockTxWait).toHaveBeenCalledTimes(2);
      expect(mockTitleEscrowDeployNewTitleEscrow).toHaveBeenCalledWith(
        "0x154fcc3c953057c9527eb180cad321b906412b5d",
        "0x1111",
        "0x2222",
        {
          nonce: 1234,
        }
      );
      expect(mockTokenRegistrySafeMint).toHaveBeenCalledWith("0x7777", "0x9999", { nonce: 1235 });
    });

    it("should throw when deployment transaction fails", async () => {
      whenTokenRegistryExist();
      mockTitleEscrowDeployNewTitleEscrow.mockRejectedValueOnce(new Error("Deployment fail"));
      const wallet = mockWallet();
      await expect(
        publishTransferableRecordJob(
          {
            nonce: 1234,
            type: "TRANSFERABLE_RECORD",
            contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
            documents: [],
            merkleRoot: "9999",
            payload: {
              ownership: {
                beneficiaryAddress: "0x1111",
                holderAddress: "0x2222",
              },
            },
          },
          wallet
        )
      ).rejects.toThrow(/Deployment fail/);
    });
    it("should throw when minting transaction fails", async () => {
      whenTokenRegistryExist();
      mockTokenRegistrySafeMint.mockRejectedValueOnce(new Error("Minting fail"));
      const wallet = mockWallet();
      await expect(
        publishTransferableRecordJob(
          {
            nonce: 1234,
            type: "TRANSFERABLE_RECORD",
            contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
            documents: [],
            merkleRoot: "9999",
            payload: {
              ownership: {
                beneficiaryAddress: "0x1111",
                holderAddress: "0x2222",
              },
            },
          },
          wallet
        )
      ).rejects.toThrow(/Minting fail/);
    });
  });
});
