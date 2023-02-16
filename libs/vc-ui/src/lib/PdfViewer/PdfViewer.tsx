import { useRef } from 'react';
import { Box } from '@mui/material';
import { PdfRenderer } from '../PdfRenderer/PdfRenderer';
import { VerifiableCredential } from '@dvp/api-interfaces';
import { VcUtility } from '../VcUtility';

export interface IPDFViewer {
  document: VerifiableCredential;
}

export const PdfViewer = ({ document }: IPDFViewer) => {
  const pdfContainer = useRef<HTMLElement | null>(null);

  const onPrint = () => {
    if (pdfContainer.current) {
      window.print();
    }
  };

  const selfLink = document?.credentialSubject?.links?.self?.href
    ? document?.credentialSubject['links']['self']['href']
    : '';
  return document?.credentialSubject['originalDocument'] ? (
    <>
      <Box
        sx={{
          '@media print': {
            margin: '0 -5px 0 -15px',
            padding: 0,
          },
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'flex-end'}
          width={'100%'}
          paddingTop={'20px'}
          sx={{ '@media print': { display: 'none' } }}
        >
          <VcUtility document={document} onPrint={onPrint} isPrintable={true} />
        </Box>
        <Box
          ref={pdfContainer}
          marginTop={'2rem'}
          marginBottom={'4rem'}
          sx={{
            '@media print': {
              margin: 0,
              padding: 0,
            },
          }}
        >
          <PdfRenderer
            pdfDocument={document?.credentialSubject['originalDocument']}
            qrUrl={selfLink}
          />
        </Box>
      </Box>
    </>
  ) : null;
};
