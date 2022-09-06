import { useLayoutEffect } from "react";
import QrScanner from "qr-scanner";
// `!!file-loader!` explicitly instruct webpack to import file with file-loader overwriting global config
import QrScannerWorkerPath from "!!file-loader!../../../node_modules/qr-scanner/qr-scanner-worker.min.js";
QrScanner.WORKER_PATH = QrScannerWorkerPath;

export const useScanner = ({ onDetected, scannerRef }) => {
  useLayoutEffect(() => {
    const qrScanner = new QrScanner(scannerRef.current, onDetected);
    qrScanner.start();
    return () => {
      qrScanner.destroy();
    };
  }, [onDetected, scannerRef]);
};
