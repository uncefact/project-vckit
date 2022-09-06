import React, { FunctionComponent } from "react";
import { WalletDecryption } from "./WalletDecryption";
export default {
  title: "Home/WalletDecryption",
  component: WalletDecryption,
  parameters: {
    componentSubtitle: "WalletDecryption.",
  },
};

export const Default: FunctionComponent = () => (
  <WalletDecryption
    decryptProgress={0}
    isIncorrectPassword={false}
    onDecryptConfigFile={alert}
    onResetConfigFile={() => alert("Reset")}
  />
);

export const Decrypting: FunctionComponent = () => (
  <WalletDecryption
    decryptProgress={0.75}
    isIncorrectPassword={false}
    onDecryptConfigFile={alert}
    onResetConfigFile={() => alert("Reset")}
  />
);

export const Error: FunctionComponent = () => (
  <WalletDecryption
    decryptProgress={0}
    onDecryptConfigFile={alert}
    onResetConfigFile={() => alert("Reset")}
    isIncorrectPassword={true}
  />
);
