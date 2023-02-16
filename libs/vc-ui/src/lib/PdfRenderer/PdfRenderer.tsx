/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Box, Divider, Paper } from '@mui/material';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { throttle } from 'lodash';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { QrCode } from '../QrCode';

interface PdfRendererProps {
  pdfDocument: string;
  qrUrl?: string;
}

export interface QrCodeData {
  x: number;
  y: number;
  size: number;
}

export const PdfRenderer: FunctionComponent<PdfRendererProps> = ({
  pdfDocument,
  qrUrl,
}) => {
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const isDragging = useRef(false);
  const dragHeadRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<QrCodeData>({
    x: 1,
    y: 1,
    size: 80,
  });
  const [PDFContainerWidth, setPDFContainerWidth] = useState<
    number | undefined
  >();
  const [PDFContainerHeight, setPDFContainerHeight] = useState<
    number | undefined
  >();

  const [numPages, setNumPages] = useState(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setDocumentLoaded(true);
    setNumPages(numPages);
  }

  const defaultQrRatio = 0.11;
  const defaultQrPaddingRatio = 0.05;
  const defaultQrBorderRatio = 0.005;

  const calculateQrSize = (pdfWidth: number) => pdfWidth * defaultQrRatio;
  const calculateQrPadding = (qrSize: number) =>
    qrSize * defaultQrPaddingRatio * 2;
  const calculateQrBorder = (qrSize: number) =>
    qrSize * defaultQrBorderRatio * 2;

  const calculateTotalQrSize = (pdfWidth: number, minSize: number) => {
    const qrSize = calculateQrSize(pdfWidth);
    const totalSize =
      qrSize + calculateQrPadding(qrSize) + calculateQrBorder(qrSize);
    return totalSize >= minSize ? totalSize : minSize;
  };

  const _setPDFContainerWidth = () => {
    const width = containerRef?.current?.offsetWidth;

    if (width) {
      const totalQrSize = calculateTotalQrSize(width, 80);
      setPosition((previous_position) => ({
        ...previous_position,
        size: totalQrSize,
      }));
    }
    setPDFContainerWidth(width);
  };

  const _setPDFContainerHeight = () => {
    const height = containerRef?.current?.offsetHeight;
    setPDFContainerHeight(height);
  };

  const throttledSetPDFContainerWidth = throttle(_setPDFContainerWidth, 500);
  const throttledSetPDFContainerHeight = throttle(_setPDFContainerHeight, 500);

  const enforceBoundary = (
    boundaryMin: number,
    boundaryMax: number,
    elementPosition: number
  ) => {
    return Math.max(boundaryMin, Math.min(boundaryMax, elementPosition));
  };

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (dragHeadRef.current && dragHeadRef.current.contains(e.target as Node)) {
      isDragging.current = true;
    }

    e.stopPropagation();
  }, []);

  const onMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
    }
  }, [PDFContainerHeight, PDFContainerWidth]);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging.current) {
        if (containerRef?.current) {
          const { clientWidth, clientHeight } = containerRef.current;

          const qrSize = position.size;
          const qrPadding = calculateQrPadding(position.size);
          const qrBorder = calculateQrBorder(position.size);
          const totalQrSize = qrSize + qrPadding + qrBorder;

          const containerBoundaryX = clientWidth - totalQrSize;
          const containerBoundaryY = clientHeight - totalQrSize;

          setPosition((prev_position) => {
            const elementPositionX = prev_position.x + e.movementX;
            const elementPositionY = prev_position.y + e.movementY;

            const boundedQrX = enforceBoundary(
              0,
              containerBoundaryX,
              elementPositionX
            );
            const boundedQrY = enforceBoundary(
              0,
              containerBoundaryY,
              elementPositionY
            );

            return { ...prev_position, x: boundedQrX, y: boundedQrY };
          });
        }
      }
      e.stopPropagation();
    },
    [position]
  );

  const onQrCodeResize = (
    newQrWidth: number,
    elementMovementX: number,
    elementMovementY: number
  ) => {
    if (containerRef?.current) {
      const { clientWidth, clientHeight } = containerRef.current;

      const qrPadding = calculateQrPadding(newQrWidth);
      const qrBorder = calculateQrBorder(newQrWidth);
      const totalQrSize = newQrWidth + qrPadding + qrBorder;

      const minQrSize = clientWidth * 0.11;

      const containerBoundaryX = clientWidth - totalQrSize;
      const containerBoundaryY = clientHeight - totalQrSize;

      if (totalQrSize > minQrSize && totalQrSize < clientWidth) {
        setPosition((prev_position: QrCodeData) => {
          const elementPositionX = prev_position.x - elementMovementX;
          const elementPositionY = prev_position.y - elementMovementY;

          const boundedQrX = enforceBoundary(
            0,
            containerBoundaryX,
            elementPositionX
          );
          const boundedQrY = enforceBoundary(
            0,
            containerBoundaryY,
            elementPositionY
          );

          return {
            x: boundedQrX,
            y: boundedQrY,
            size: newQrWidth,
          };
        });
      }
    }
  };

  useEffect(() => {
    setPDFContainerWidth(containerRef?.current?.offsetWidth);
    setPDFContainerHeight(containerRef?.current?.offsetHeight);

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', throttledSetPDFContainerWidth);
    window.addEventListener('resize', throttledSetPDFContainerHeight);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', throttledSetPDFContainerWidth);
      window.removeEventListener('resize', throttledSetPDFContainerHeight);
    };
  }, [
    onMouseMove,
    onMouseDown,
    onMouseUp,
    throttledSetPDFContainerWidth,
    throttledSetPDFContainerHeight,
  ]);

  return (
    <Box
      id="pdf_area"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      data-testid="pdf-container"
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
        UserSelect: 'none',
      }}
    >
      <Paper
        sx={{
          '@media print': {
            boxShadow: 'none',
          },
        }}
      >
        <Document file={pdfDocument} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Box data-testid={`page_${index + 1}`}>
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={PDFContainerWidth}
                onLoadSuccess={() => {
                  if (
                    containerRef?.current?.offsetWidth &&
                    containerRef?.current?.offsetHeight
                  ) {
                    const totalQrSize = calculateTotalQrSize(
                      containerRef?.current?.offsetWidth,
                      80
                    );
                    setPosition((previous_position) => ({
                      ...previous_position,
                      size: totalQrSize,
                    }));
                  }
                }}
              />
              {numPages !== index + 1 && (
                <Divider
                  key={`page_divider_${index + 1}`}
                  data-testid={`page_${index + 1}_divider`}
                  sx={{
                    borderBottomWidth: 5,
                    '@media print': { display: 'none' },
                  }}
                />
              )}
            </Box>
          ))}
        </Document>
      </Paper>
      {documentLoaded && qrUrl && (
        <Box
          sx={{
            left: position.x,
            top: position.y,
            background: 'white',
            position: 'absolute',
            zIndex: 0,
            padding: `${calculateQrPadding(position.size) / 2}px`,
            border: `${calculateQrBorder(position.size) / 2}px solid black`,
            '@media print': {
              border: 0,
              left: position.x,
              top: position.y,
            },
          }}
          ref={dragHeadRef}
          data-testid="qr-code-element"
        >
          <QrCode
            url={qrUrl}
            qrCodeOptions={{
              width: position.size,
              margin: 0,
            }}
            onResize={onQrCodeResize}
            isResizable={true}
          />
        </Box>
      )}
    </Box>
  );
};
