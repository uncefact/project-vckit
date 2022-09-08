import { BarTrack } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { ContentFrame } from "../../UI/ContentFrame";
import { Wrapper } from "../../UI/Wrapper";

interface WalletDecryption {
  decryptProgress: number;
  onDecryptConfigFile: (password: string) => void;
  onResetConfigFile: () => void;
  isIncorrectPassword: boolean;
}

export const WalletDecryption: FunctionComponent<WalletDecryption> = ({
  decryptProgress,
  isIncorrectPassword,
  onDecryptConfigFile,
  onResetConfigFile,
}) => {
  const [password, setPassword] = useState("");
  const onLogin = (event: React.SyntheticEvent): void => {
    onDecryptConfigFile(password);
    event.preventDefault();
  };
  const isDecrypting = decryptProgress > 0 && decryptProgress < 1;

  let inputBorderCSS = `w-full border-solid border h-10 p-3 rounded-lg`;

  inputBorderCSS += isIncorrectPassword ? ` border-rose` : ` border-cloud-200`;
  inputBorderCSS += isDecrypting ? ` bg-cloud-200` : ``;

  return (
    <Wrapper>
      <h2 data-testid="wallet-decryption-title" className="mb-8">
        Create and Revoke Document
      </h2>
      <ContentFrame>
        {isDecrypting && <BarTrack progress={decryptProgress} className="mb-4" />}
        <Card>
          <form className="relative flex flex-col rounded">
            <h3 className="mb-4" data-testid="login-title">
              Login
            </h3>
            <input
              data-testid="password-field"
              placeholder="Password"
              className={inputBorderCSS}
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              disabled={isDecrypting}
              autoComplete="off"
            />
            {isIncorrectPassword && (
              <div data-testid="password-field-msg" className="text-rose text-sm mt-2">
                Invalid password. Please try again.
              </div>
            )}
            <div
              data-testid="reset-button"
              className="text-cerulean-200 font-bold mt-4 cursor-pointer"
              onClick={onResetConfigFile}
            >
              Upload a new config file
            </div>
            <div className="my-8 w-auto">
              <Button data-testid="login-button" onClick={onLogin} disabled={isDecrypting}>
                Login
              </Button>
            </div>
          </form>
        </Card>
      </ContentFrame>
    </Wrapper>
  );
};
