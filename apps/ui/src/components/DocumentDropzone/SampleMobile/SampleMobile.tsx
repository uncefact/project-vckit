import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button, ButtonVariant } from "../../UI/Button";
import { setActive } from "../../../reducers/sample";
import { updateCertificate } from "../../../reducers/certificate";
import { loadDemoCertificate } from "../../VerifyPageContent/helpers";
import { ChainId } from "../../../constants/chain-info";

const topMessage = "To verify a demo document";
const btnMessage = "Click Here";
const bottomMessage = "or";

export const SampleMobile: FunctionComponent<{ currentChainId: ChainId | undefined }> = ({
  currentChainId,
}): React.ReactElement => {
  const dispatch = useDispatch();
  const loadCertificate = React.useCallback((payload: any) => dispatch(updateCertificate(payload)), [dispatch]);
  return currentChainId ? (
    <div className="md:hidden flex flex-col">
      <p className="font-bold text-xl mb-4">{topMessage}</p>
      <Button
        variant={ButtonVariant.OUTLINE_PRIMARY}
        className="mx-auto"
        draggable={false}
        onClick={(e: React.SyntheticEvent) => {
          e.stopPropagation();
          loadDemoCertificate(loadCertificate, currentChainId);
          dispatch(setActive());
        }}
      >
        {btnMessage}
      </Button>
      <p className="font-bold text-xl mt-4">{bottomMessage}</p>
    </div>
  ) : (
    <div>You are currently on an unsupported network.</div>
  );
};
