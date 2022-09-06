import { FunctionComponent, useState, useEffect } from "react";
import { decryptWalletOrSigner } from "../../../common/config/decrypt";
import { useConfigContext } from "../../../common/contexts/config";
import { usePersistedConfigFile } from "../../../common/hooks/usePersistedConfigFile";
import { WalletDecryption } from "./WalletDecryption";
import { getLogger } from "../../../utils/logger";

const { stack } = getLogger("Wallet Decryption Container");

export const WalletDecryptionContainer: FunctionComponent = () => {
  const { setConfig, config } = useConfigContext();
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
  const { configFile, setConfigFile } = usePersistedConfigFile();
  const [decryptProgress, setDecryptProgress] = useState<number>(0);

  useEffect(() => {
    // Remove "as any" when we implement backend signing
    if (configFile && !config && !configFile.wallet) {
      setConfig({
        forms: configFile.forms,
      } as any);
    }
  });

  const onResetConfigFile = (): void => {
    setConfigFile();
  };

  const onDecryptConfigFile = async (password: string): Promise<void> => {
    if (!configFile) return;
    try {
      setIsIncorrectPassword(false);
      const walletOrSigner = await decryptWalletOrSigner(configFile, password, (progress) => {
        setDecryptProgress(progress);
      });
      setConfig({
        network: configFile.network,
        wallet: walletOrSigner,
        forms: configFile.forms,
        documentStorage: configFile.documentStorage,
      });
    } catch (e) {
      if (e instanceof Error) {
        setIsIncorrectPassword(true);
        stack(e);
      }
    }
  };

  return (
    <WalletDecryption
      decryptProgress={decryptProgress}
      isIncorrectPassword={isIncorrectPassword}
      onDecryptConfigFile={onDecryptConfigFile}
      onResetConfigFile={onResetConfigFile}
    />
  );
};
