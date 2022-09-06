import { useEffect, useState } from "react";
import { useContractFunctionHook } from "@govtechsg/ethers-contract-hook";
import { Contract } from "ethers";
import { getLogger } from "../../utils/logger";

const { error } = getLogger("services:usesupportsinterface");

interface Erc165Contract extends Contract {
  supportsInterface: (interfaceId: []) => Promise<boolean> | undefined;
}

/**
 * This hook calls checks if a given smart contract instance supports the given Erc165 interface
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md
 * @returns true if supportsInterface(id) returns true
 * @returns false if supportsInterface(id) returns false, or throws error because method is not supported, or contract not deployed
 * errorMessage is populated if any other error is returned
 */
export const useSupportsInterface = (
  contractInstance: Erc165Contract | undefined,
  interfaceId: string
): {
  isInterfaceType?: boolean;
  errorMessage?: string;
} => {
  const [isInterfaceType, setIsInterfaceType] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    call: supportsInterface,
    value: isSameInterfaceType,
    errorMessage: supportsInterfaceErrorMessage,
    state,
    reset: resetSupportsInterface,
  } = useContractFunctionHook(contractInstance, "supportsInterface");

  // Check if token is type of interface on load
  useEffect(() => {
    supportsInterface(interfaceId);
    return () => {
      setIsInterfaceType(undefined);
      setErrorMessage(undefined);
      resetSupportsInterface();
    };
  }, [interfaceId, supportsInterface, contractInstance, resetSupportsInterface]);

  // On result return, infer the types
  useEffect(() => {
    if (state === "ERROR") {
      error(supportsInterfaceErrorMessage);
      if (supportsInterfaceErrorMessage?.includes("contract not deployed")) {
        setIsInterfaceType(false);
      } else if (supportsInterfaceErrorMessage?.includes("call revert exception")) {
        // ethers@5.x updated error message type
        // error for method doesnt exist (can infer that contract does not inherit from Erc165)
        setIsInterfaceType(false);
      } else {
        setErrorMessage(supportsInterfaceErrorMessage);
      }
    } else if (state === "CONFIRMED") {
      setIsInterfaceType(isSameInterfaceType?.[0]);
    }
  }, [interfaceId, isSameInterfaceType, state, supportsInterfaceErrorMessage]);

  return { isInterfaceType, errorMessage };
};
