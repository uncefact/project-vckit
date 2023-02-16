import { VerifiableCredential } from '@dvp/api-interfaces';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { copyToClipboard } from '../../utils';
import { Button } from '../Button';
import { QrCode } from '../QrCode';

export interface IVcUtility {
  document: VerifiableCredential;
  onPrint: () => void;
  isPrintable: boolean;
}

export const VcUtility = ({ document, onPrint, isPrintable }: IVcUtility) => {
  const [isQrCodePopoverOpen, setIsQrCodePopoverOpen] = useState(false);
  const [isUriCopiedToClipboard, setIsUriCopiedToClipboard] = useState(false);

  const verifiableCredential = document;
  const { name, links } = verifiableCredential.credentialSubject ?? {};

  const fileName = (name as string) ?? 'untitled';
  const qrcodeUrl = links?.self?.href ?? '';

  return (
    <Stack
      direction={'row'}
      sx={{
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', sm: 'flex-end' },
        width: '100%',
      }}
      spacing={2}
      marginBottom={'16px'}
      marginTop={'16px'}
      data-testid="vc-utility"
    >
      {qrcodeUrl && (
        <Box>
          <Button
            label="QRCode"
            variant="outlined"
            aria-label="View QRCode & Uniform Resource Identifier"
            data-testid="uri-dropdown-button"
            sx={{ padding: { sx: '4px 10px', sm: '8px 22px' } }}
            aria-expanded={isQrCodePopoverOpen}
            onClick={() => {
              setIsQrCodePopoverOpen(!isQrCodePopoverOpen);
            }}
          />
          <Paper
            sx={{
              display: isQrCodePopoverOpen ? 'flex' : 'none',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              position: 'absolute',
              border: '1px solid grey',
              borderRadius: '10px',
              width: 'min-content',
              padding: '20px 10px 15px 10px',
              marginTop: '10px',
              right: '20px',
              zIndex: 1,
            }}
          >
            <TextField
              aria-label="Verifiable Credentials Uniform Resource Identifier"
              disabled
              data-testid="vc-uri"
              value={qrcodeUrl}
              sx={{
                width: '92%',
                marginBottom: '10px',
                '& input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={0}
                      aria-label={
                        isUriCopiedToClipboard
                          ? 'Uniform Resource Identifier copied to the clipboard'
                          : 'Copy the Verifiable Credentials Uniform Resource Identifier to the clipboard'
                      }
                      data-testid="copy-uri-button"
                      onClick={() => {
                        void copyToClipboard(qrcodeUrl);
                        setIsUriCopiedToClipboard(true);
                        setInterval(
                          () => setIsUriCopiedToClipboard(false),
                          1000
                        );
                      }}
                    >
                      <ContentCopyIcon color={'primary'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <QrCode url={qrcodeUrl} qrCodeOptions={{ width: 200 }} />
          </Paper>
        </Box>
      )}
      {isPrintable && (
        <Box>
          <Button
            label="Print"
            variant="outlined"
            aria-label="Print the Verifiable Credential"
            data-testid="print-button"
            sx={{ padding: { sx: '4px 10px', sm: '8px 22px' } }}
            onClick={() => {
              onPrint();
            }}
          />
        </Box>
      )}
      <Box>
        <Link
          tabIndex={-1}
          data-testid="download-link"
          href={`data:text/json;,${encodeURIComponent(
            JSON.stringify(document, null, 2)
          )}`}
          download={`${fileName}.json`}
          rel="noreferrer"
          sx={{ textDecoration: 'none' }}
        >
          <Button
            label="Download"
            aria-label="Download the Verifiable Credential"
            aria-expanded={false}
            data-testid="download-button"
            sx={{ padding: { sx: '4px 10px', sm: '8px 22px' } }}
            onClick={() => null}
          />
        </Link>
      </Box>
    </Stack>
  );
};
