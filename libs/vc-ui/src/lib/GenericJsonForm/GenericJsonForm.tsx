import { createAjv, JsonSchema, UISchemaElement } from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Alert, Box, Divider, ThemeProvider } from '@mui/material';
import { Container } from '@mui/system';
import { deepmerge } from '@mui/utils';
import { ErrorObject } from 'ajv';
import { useState } from 'react';
import { jsonFormTheme } from '../../theme';
import { Button } from '../Button';
import { Text } from '../Text';
import { Renderers } from './Renders';
import { JsonFormsErrorMapper } from './util';

interface genericJsonFormProps {
  schema: JsonSchema;
  uiSchema?: UISchemaElement;
  onSubmit: (data: any) => void;
  title: string;
  submitting: boolean;
  subTitle?: string;
  submissionError?: string;
  formData?: FormsData;
}

export interface FormsData {
  data?: any;
  errors?: ErrorObject<string, Record<string, any>, unknown>[] | undefined;
}

export const GenericJsonForm = ({
  schema,
  uiSchema,
  onSubmit,
  title,
  subTitle,
  submitting,
  submissionError,
  formData,
}: genericJsonFormProps) => {
  const [formValues, setFormValues] = useState<FormsData>({ ...formData });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const ajv = createAjv();

  const onFormUpdate = (formData: FormsData) => {
    setFormValues(formData);
    if (formData.errors && formData.errors.length === 0) {
      //Json forms dosnt do deep checks for requird. so this checks for that.
      const isValid = ajv.validate(schema, formData?.data);
      if (isValid) setIsFormValid(true);
      else setIsFormValid(false);
    } else setIsFormValid(false);
  };
  return (
    <Container
      maxWidth={false}
      sx={{
        // '@media (min-width:800px)': { width: '90%' },
        maxWidth: '800px',
      }}
    >
      <Text variant="h4" sx={{ fontWeight: 'bold' }}>
        {title}
      </Text>
      {subTitle && (
        <Text variant="h5" sx={{ fontWeight: 'bold', paddingTop: '20px' }}>
          {subTitle}
        </Text>
      )}

      <Divider sx={{ marginY: '40px' }} />

      <ThemeProvider theme={(theme) => deepmerge(jsonFormTheme, theme)}>
        <JsonForms
          ajv={ajv}
          schema={schema}
          data={formValues?.data}
          cells={materialCells}
          renderers={[...Renderers, ...materialRenderers]}
          uischema={uiSchema}
          onChange={({ data, errors }) => onFormUpdate({ data, errors })}
          i18n={{ translateError: JsonFormsErrorMapper }}
        />
      </ThemeProvider>
      {submissionError && <Alert severity="error">{submissionError}</Alert>}
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'flex-end'}
        marginTop={'2rem'}
      >
        <Button
          label="Submit"
          disabled={!isFormValid}
          loading={submitting}
          onClick={() => onSubmit(formValues?.data)}
        />
      </Box>
    </Container>
  );
};
