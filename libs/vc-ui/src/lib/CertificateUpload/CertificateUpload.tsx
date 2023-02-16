import {
  Alert,
  Box,
  Input,
  InputLabel,
  Stack,
  SxProps,
  useTheme,
} from '@mui/material';
import React, {
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import OpenBoxSVG from '../../assets/OpenBox.svg';
import { Text } from '../Text';

interface ICertificateUpload {
  handleFiles: (files: FileList) => void;
  errorMessage?: string;
  acceptMessage?: string;
  style?: SxProps;
}

export const CertificateUpload = ({
  handleFiles,
  errorMessage,
  acceptMessage,
  style,
}: ICertificateUpload) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const theme = useTheme();

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.focus();
    }
  }, [errorMessage]);

  const handleDrag = function (
    event: DragEvent<HTMLDivElement | HTMLFormElement>
  ) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = function (event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event?.dataTransfer?.files && event.dataTransfer.files[0]) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleChange = function (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    event.preventDefault();
    const target = event?.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      handleFiles(target.files);
    }
  };

  const onButtonClick = (event: any) => {
    event.preventDefault();
    if (event.key === ' ' || event.key === 'Enter') {
      inputRef?.current?.click();
    }
  };

  const textColor = useMemo(
    () => (errorMessage ? 'white' : 'black'),
    [errorMessage]
  );

  return (
    <React.Fragment>
      <Box
        onDragEnter={handleDrag}
        id="certificate-upload"
        sx={{
          height: '16rem',
          textAlign: 'center',
        }}
      >
        <Input
          inputRef={inputRef}
          type="file"
          id="input-file-upload"
          inputProps={{ 'data-testid': 'input-file-upload' }}
          onChange={handleChange}
          sx={{ display: 'none' }}
        />

        <InputLabel
          id="label-file-upload"
          htmlFor="input-file-upload"
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: '2px',
            borderRadius: '1rem',
            borderStyle: 'dashed',
            borderColor: '#cbd5e1',
            backgroundColor: errorMessage
              ? theme.palette.error.main || '#AD1A1F'
              : 'white',
            // Override style
            ...style,
          }}
          aria-label="Upload file"
        >
          <Stack
            sx={{
              justifyContent: 'space-evenly',
              height: '100%',
            }}
          >
            <Stack
              sx={{
                justifyContent: 'space-evenly',
                alignItems: 'center',
                height: '100%',
                color: textColor,
              }}
            >
              <Box
                component="img"
                sx={{
                  maxHeight: 61,
                }}
                src={OpenBoxSVG as string}
              />
              <Text
                fontWeight="bold"
                color={textColor}
                variant="h6"
                tabIndex={-1}
              >
                Drop your document to verify
              </Text>
              {errorMessage && (
                <span ref={errorRef} aria-label={errorMessage} tabIndex={0} />
              )}

              <Box>
                <Text
                  sx={{
                    display: 'inline',
                  }}
                  variant="body1"
                  tabIndex={-1}
                >
                  Or &nbsp;
                </Text>
                <Box
                  role="button"
                  aria-controls="filename"
                  tabIndex={0}
                  aria-label={`Select a file. ${acceptMessage}`}
                  onKeyUp={onButtonClick}
                  sx={{
                    display: 'inline',
                    borderBottom: '1px solid',
                    ':hover': { cursor: 'pointer' },
                  }}
                >
                  Select a file
                </Box>
              </Box>

              {acceptMessage && (
                <Text variant="body1" tabIndex={-1}>
                  {acceptMessage}
                </Text>
              )}
              {errorMessage && (
                <Alert
                  severity="error"
                  id="vc-upload-error"
                  aria-hidden
                  sx={{ width: 'fit-content' }}
                >
                  {errorMessage}
                </Alert>
              )}
            </Stack>
          </Stack>
        </InputLabel>
        {dragActive && (
          <Box
            sx={{
              position: 'absolute',
              height: ' 100%',
              borderRadius: '1rem',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragExit={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        )}
      </Box>
    </React.Fragment>
  );
};
