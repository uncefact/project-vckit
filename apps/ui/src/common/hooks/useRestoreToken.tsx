import { useState, useCallback, useEffect } from "react";
import { ContractFunctionState } from "@govtechsg/ethers-contract-hook";
import { getLogger } from "../../utils/logger";
import { TradeTrustErc721 } from "@govtechsg/token-registry/types/TradeTrustErc721";
import { TitleEscrowCreator } from "@govtechsg/token-registry/dist/ts/contracts/TitleEscrowCreator";
import { TitleEscrowCreatorFactory, getTitleEscrowCreatorAddress, TitleEscrowFactory } from "@govtechsg/token-registry";
import { ContractReceipt, providers, Signer } from "ethers";
import { NETWORK } from "../../config";
import { UnsupportedNetworkError } from "../errors";

const { error: errorLogger } = getLogger("services:userestoretoken");

//Wrapper Method to connect to instance of TitleEscrowFactory
export const getTitleEscrowCreator = async (provider: providers.Provider): Promise<TitleEscrowCreator> => {
  let creatorContractAddress;
  switch (NETWORK) {
    case "ropsten":
      creatorContractAddress = getTitleEscrowCreatorAddress(3);
      break;
    case "rinkeby":
      creatorContractAddress = getTitleEscrowCreatorAddress(4);
      break;
    default:
      creatorContractAddress = getTitleEscrowCreatorAddress(1);
      break;
  }
  if (!creatorContractAddress) throw new Error(`Title escrow contract creator is not declared for ${NETWORK} network`);
  return TitleEscrowCreatorFactory.connect(creatorContractAddress, provider);
};

const validateRestoredEntities = async (
  provider: providers.Provider | Signer,
  address: string,
  previousBeneficiary: string,
  previousHolder: string,
  transactionDetails: ContractReceipt
): Promise<void> => {
  const newTitleEscrow = await TitleEscrowFactory.connect(address, provider);
  const beneficiaryDeferred = newTitleEscrow.beneficiary();
  const holderDeferred = newTitleEscrow.holder();
  const [beneficiary, holder] = await Promise.all([beneficiaryDeferred, holderDeferred]);

  if (beneficiary !== previousBeneficiary || holder !== previousHolder)
    throw new Error(`Token was not restored to owner and beneficiary. Tx: ${JSON.stringify(transactionDetails)}`);
};

const sendToTitleEscrow = async (
  previousBeneficiary: string,
  previousHolder: string,
  provider: providers.Provider | Signer,
  contractInstance: TradeTrustErc721,
  tokenId: string
): Promise<void> => {
  const sendToNewEscrowReceipt = await contractInstance?.sendToNewTitleEscrow(
    previousBeneficiary,
    previousHolder,
    tokenId
  );
  const sendToNewEscrowTx = await sendToNewEscrowReceipt.wait();

  const sendTokenArgs = sendToNewEscrowTx.events?.find((event) => event.event === "Transfer")?.args;
  if (sendTokenArgs) {
    const newTitleEscrowAddress = sendTokenArgs.to;
    await validateRestoredEntities(
      provider,
      newTitleEscrowAddress,
      previousBeneficiary,
      previousHolder,
      sendToNewEscrowTx
    );
  } else throw new Error(`Token was not successfully restored. Tx: ${JSON.stringify(sendToNewEscrowTx)}`);
};

const deployAndSendToTitleEscrow = async (
  previousBeneficiary: string,
  previousHolder: string,
  provider: providers.Provider | Signer,
  contractInstance: TradeTrustErc721,
  tokenId: string
): Promise<void> => {
  const titleEscrowCreatorContract = await getTitleEscrowCreator(provider as providers.Provider);

  // Deploy new title escrow smart contract to own document
  const escrowDeploymentReceipt = await titleEscrowCreatorContract.deployNewTitleEscrow(
    contractInstance.address,
    previousBeneficiary,
    previousHolder
  );

  const escrowDeploymentTx = await escrowDeploymentReceipt.wait();
  const deployedTitleEscrowArgs = escrowDeploymentTx.events?.find(
    (event) => event.event === "TitleEscrowDeployed"
  )?.args;
  if (!deployedTitleEscrowArgs || !deployedTitleEscrowArgs[0])
    throw new Error(`Address for deployed title escrow cannot be found. Tx: ${JSON.stringify(escrowDeploymentTx)}`);
  const deployedTitleEscrowAddress = deployedTitleEscrowArgs[0];

  // use minter restore token method to send token back to last known bene and holder
  const sendTokenReceipt = await contractInstance.sendToken(deployedTitleEscrowAddress, tokenId);
  const sendTokenTx = await sendTokenReceipt.wait();
  const sendTokenArgs = sendTokenTx.events?.find((event) => event.event === "Transfer")?.args;
  if (sendTokenArgs && sendTokenArgs[1] === deployedTitleEscrowAddress) {
    const newTitleEscrowAddress = sendTokenArgs.to;
    await validateRestoredEntities(provider, newTitleEscrowAddress, previousBeneficiary, previousHolder, sendTokenTx);
  } else throw new Error(`Token was not successfully restored. Tx: ${JSON.stringify(sendTokenTx)}`);
};

/**
 * This hook restores tokens that has been surrendered to Token Registry
 * Restoring a document which has been surrendered to issuer takes 2 steps:
 * 1. Deploying TitleEscrow with owner and holder from last known beneficiary
 * 2. Transferring ownership of document from Token registry to TitleEscrow in step 1
 * @returns function which combines from process described
 * errorMessage is populated if any other error is returned
 * state is changed based on the step of the ethereum transaction
 */
export const useRestoreToken = (
  provider: providers.Provider | Signer | undefined,
  contractInstance?: TradeTrustErc721,
  tokenId?: string
): {
  restoreToken: (previousBeneficiary: string, previousHolder: string) => Promise<void>;
  state: ContractFunctionState;
  errorMessage?: string;
} => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [state, setState] = useState<ContractFunctionState>("UNINITIALIZED");

  const restoreToken = async (previousBeneficiary: string, previousHolder: string): Promise<void> => {
    setState("INITIALIZED");
    try {
      if (!provider) throw new UnsupportedNetworkError();
      if (!tokenId) throw new Error("Ownership data is not provided");
      if (!contractInstance?.address) throw new Error("Token Registry Instance should have address");
      const supportsSendToTitleEscrow = await contractInstance?.supportsInterface("0x9f9e69f3");

      setState("PENDING_CONFIRMATION");
      if (supportsSendToTitleEscrow)
        await sendToTitleEscrow(previousBeneficiary, previousHolder, provider, contractInstance, tokenId);
      else await deployAndSendToTitleEscrow(previousBeneficiary, previousHolder, provider, contractInstance, tokenId);

      setState("CONFIRMED");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(JSON.stringify(error));
        errorLogger(error);
        setState("ERROR");
      }
    }
  };

  const reset = useCallback(() => {
    setState("UNINITIALIZED");
    setErrorMessage(undefined);
  }, []);

  // If any of the dependency is updated, should reset function
  useEffect(() => () => reset(), [contractInstance, provider, reset, tokenId]);

  return { restoreToken, state, errorMessage };
};
