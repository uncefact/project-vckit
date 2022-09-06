import React from "react";
import { useScanner } from "./Scanner";

export type QrDataType = any;

interface QrReaderZoneProps {
  handleQrScanned: (data: QrDataType) => void;
}
const QrReaderZone = ({ handleQrScanned }: QrReaderZoneProps): React.ReactElement => {
  const scannerRef = React.useRef(null);
  const onScan = (data: QrDataType) => {
    if (data) handleQrScanned(data);
  };
  useScanner({
    scannerRef,
    onDetected: (result: QrDataType) => onScan(result),
  });

  return (
    <div className="overflow-hidden relative w-full" style={{ paddingTop: "100%" }}>
      <video
        data-testid="qr-code-reader"
        ref={scannerRef}
        className={"top-0 left-0 block absolute overflow-hidden w-full h-full object-cover scale-x-0"}
      />
    </div>
  );
};

export default QrReaderZone;
