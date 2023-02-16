import { FunctionComponent } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps, rankWith, optionIs } from '@jsonforms/core';
import { Box, Typography, FormHelperText } from '@mui/material';
import { PdfRenderer } from '../../../../../PdfRenderer/PdfRenderer';
import { FileUpload } from '../../../../../FileUpload';

export const PdfUploadWidgetControl: FunctionComponent<ControlProps> = ({
  data,
  handleChange,
  path,
  errors,
  required,
}) => {
  const handleFileUpload = (data: string) => {
    handleChange(path, data);
  };
  return (
    <Box
      sx={{
        position: 'relative',
        marginLeft: '0.4rem',
        marginTop: '1rem',
        marginBottom: '1rem',
      }}
    >
      <FileUpload
        onChange={handleFileUpload}
        buttonText={'Upload Document'}
        multiple={false}
        acceptedFiles={'.pdf'}
        required={required}
      />
      <FormHelperText
        sx={{ paddingLeft: '0.5rem' }}
        error={errors ? true : false}
      >
        {errors}
      </FormHelperText>
      {data && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography
            variant={'h6'}
            align={'center'}
            sx={{ fontWeight: 'bold', marginBottom: '1rem' }}
          >
            Document Preview
          </Typography>
          <PdfRenderer pdfDocument={data} />
        </Box>
      )}
    </Box>
  );
};

export const pdfUploadWidgetControlTester = rankWith(
  2,
  optionIs('widget', 'fileUpload')
);

export default withJsonFormsControlProps(PdfUploadWidgetControl);
