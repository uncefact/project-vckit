import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";

import throttle from "lodash.throttle";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import QRCode from "react-qr-code";
import { ActionsUrlObject } from "../../..//types";
import { useFormsContext } from "../../../common/contexts/forms";

interface WatermarkPreviewInput {
  qrURL: ActionsUrlObject | undefined;
  dataURL: string;
  qrPositionInitial?: { x: number; y: number; size: number };
}

const QR_SIZE = 80;
const QR_PADDING = 10;
const DefaultQrValue = "qrPlaceHolder";

export const WatermarkPreview: FunctionComponent<WatermarkPreviewInput> = ({
  qrURL,
  dataURL,
  qrPositionInitial = { x: 20, y: 20, size: QR_SIZE },
}) => {
  const [documentLoaded, setDocumentLoaded] = useState(false);

  const isDragging = useRef(false);
  const dragHeadRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(qrPositionInitial);
  const [PDFContainerWidth, setPDFContainerWidth] = useState<number | undefined>();
  const [PDFContainerHeight, setPDFContainerHeight] = useState<number | undefined>();

  const { currentForm, setCurrentFormData } = useFormsContext();

  const _setPDFContainerWidth = () => {
    const width = containerRef?.current?.offsetWidth;
    setPDFContainerWidth(width);
  };

  const _setPDFContainerHeight = () => {
    const height = containerRef?.current?.offsetHeight;
    setPDFContainerHeight(height);
  };

  const throttledSetPDFContainerWidth = throttle(_setPDFContainerWidth, 500);
  const throttledSetPDFContainerHeight = throttle(_setPDFContainerHeight, 500);

  const onMouseDown = useCallback((e) => {
    if (dragHeadRef.current && dragHeadRef.current.contains(e.target)) {
      isDragging.current = true;
    }

    e.stopPropagation();
  }, []);

  const setFormData = useCallback(
    (containerWidth: number, containerHeight: number) => {
      if (currentForm) {
        const adjustedQrSize = QR_SIZE + QR_PADDING;
        const qrRatio = adjustedQrSize / containerWidth;
        const invertedYAxis = containerHeight - (position.y + QR_PADDING);
        const xRatio = position.x / containerWidth;
        const yRatio = (invertedYAxis - QR_SIZE) / containerHeight;
        setCurrentFormData({
          ...currentForm.data,
          formData: {
            ...currentForm.data.formData,
            credentialSubject: { ...currentForm.data.formData.credentialSubject, ...qrURL },
            watermark: {
              qrCode: {
                x: xRatio,
                y: yRatio,
                size: qrRatio,
              },
            },
          },
        });
      }
    },
    [currentForm, position, qrURL, setCurrentFormData]
  );

  const onMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      if (PDFContainerHeight && PDFContainerWidth) {
        setFormData(PDFContainerWidth, PDFContainerHeight);
      }
    }
  }, [PDFContainerHeight, PDFContainerWidth, setFormData]);

  const onMouseMove = useCallback((e) => {
    if (isDragging.current) {
      if (dragHeadRef.current && dragHeadRef.current.parentElement) {
        const parentElementWidth = dragHeadRef.current.parentElement.clientWidth - 11;
        const parentElementHeight = dragHeadRef.current.parentElement.clientHeight - 11;

        setPosition((prev_position) => {
          const boundedQrX = Math.max(1, Math.min(parentElementWidth - QR_SIZE, prev_position.x + e.movementX));
          const boundedQrY = Math.max(1, Math.min(parentElementHeight - QR_SIZE, prev_position.y + e.movementY));

          return { ...prev_position, x: boundedQrX, y: boundedQrY };
        });
      }
    }
    e.stopPropagation();
  }, []);

  useEffect(() => {
    setPDFContainerWidth(containerRef?.current?.offsetWidth);
    setPDFContainerHeight(containerRef?.current?.offsetHeight);

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("resize", throttledSetPDFContainerWidth);
    document.addEventListener("resize", throttledSetPDFContainerHeight);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("resize", throttledSetPDFContainerWidth);
      document.removeEventListener("resize", throttledSetPDFContainerHeight);
    };
  }, [onMouseMove, onMouseDown, onMouseUp, throttledSetPDFContainerWidth, throttledSetPDFContainerHeight]);

  return (
    <div
      id="id_qr_code_area"
      className="relative select-none"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      data-testid="qr-code-container"
      ref={containerRef}
    >
      <div>
        <Document
          file={dataURL}
          onLoadSuccess={() => {
            setDocumentLoaded(true);
          }}
          onLoadError={console.error}
        >
          <Page
            pageNumber={1}
            className="border border-cloud-200"
            width={PDFContainerWidth && PDFContainerWidth - 2}
            onLoadSuccess={() => {
              if (containerRef?.current?.offsetWidth && containerRef?.current?.offsetHeight) {
                setFormData(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
              }
            }}
          />
        </Document>
      </div>
      {documentLoaded && (
        <div
          className="absolute border-1 border-black z-9"
          style={{ left: position.x, top: position.y, padding: `${QR_PADDING / 2}px`, background: "white" }}
          ref={dragHeadRef}
          data-testid="qr-code-element"
        >
          <QRCode value={qrURL?.links?.self?.href ?? DefaultQrValue} size={QR_SIZE} />
        </div>
      )}
    </div>
  );
};
