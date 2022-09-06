import React from "react";
import { Button } from "../UI/Button";
import { useDispatch } from "react-redux";
import { processQrCode } from "../../reducers/certificate";
import QrReader, { QrDataType } from "../QrReader/qrReader";
import { CertificateDropZone } from "./CertificateDropZone";

const DisableMessage = "Disable";

export const CertificateDropZoneContainer = (): React.ReactElement => {
  const [qrReaderVisible, setQrReaderVisible] = React.useState(false);
  const dispatch = useDispatch();

  const handleQrScanned = React.useCallback(
    (data: QrDataType) => {
      dispatch(processQrCode(data));
      setQrReaderVisible(false);
    },
    [dispatch, setQrReaderVisible]
  );

  const toggleQrReaderVisible = React.useCallback(() => {
    setQrReaderVisible(!qrReaderVisible);
  }, [qrReaderVisible, setQrReaderVisible]);

  return qrReaderVisible ? (
    <>
      <QrReader handleQrScanned={handleQrScanned} />
      <div className="py-2 text-center">
        <Button className="block mx-auto mb-5 md:hidden" onClick={toggleQrReaderVisible}>
          {DisableMessage}
        </Button>
      </div>
    </>
  ) : (
    <CertificateDropZone toggleQrReaderVisible={toggleQrReaderVisible} />
  );
};
