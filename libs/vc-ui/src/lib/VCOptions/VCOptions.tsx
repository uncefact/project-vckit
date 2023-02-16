import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { Text } from '../Text';

export interface Form {
  schema: Record<string, unknown>;
  uiSchema: Record<string, unknown>;
}

export interface FormOption {
  id: string;
  name: string;
  displayName: string;
  fullForm?: Form;
  partialForm?: Form;
  credentialType?: string;
  formType?: string;
}

interface VCOptionsProps {
  forms: FormOption[];
  onFormSelected: (value: FormOption) => void;
}

export const VCOptions: FunctionComponent<VCOptionsProps> = ({
  forms,
  onFormSelected,
}) => {
  const [availableForms, setAvailableForms] = useState<FormOption[]>([]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [selectedDocumentName, setSelectedDocumentName] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedCredential, setSelectedCredential] = useState('');

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    setAvailableForms(forms);
  }, [forms]);

  const handleSelectedDocument = (event: SelectChangeEvent<string>) => {
    setSelectedDocument(event.target.value);
    setSelectedDocumentName(
      availableForms.filter((value) => value.id === event.target.value)[0].name
    );
  };

  const handleSubmit = () => {
    const form = availableForms.filter(
      (form) => form.id === selectedDocument
    )[0];

    const formWithTypes = {
      ...form,
      credentialType: selectedCredential,
      formType: selectedForm,
    };

    onFormSelected(formWithTypes);
  };

  const isComplete = selectedDocument && selectedForm && selectedCredential;

  return (
    <Box>
      <Text
        fontWeight="bold"
        variant="h5"
        sx={{
          paddingTop: '10px',
          paddingBottom: '15px',
        }}
      >
        Verifiable Credential Options
      </Text>
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel
          id="form-select-label"
          htmlFor={'select-input-label-id'}
          aria-label={`Select a document to issue. ${
            selectedDocumentName ? `${selectedDocumentName} selected` : ''
          }`}
        >
          Document Type
        </InputLabel>

        <Select
          labelId="form-select-label"
          label={'Document Type'}
          value={selectedDocument}
          onChange={handleSelectedDocument}
          role={'listbox'}
          data-testid={'form-select-document-type'}
          inputProps={{ id: 'select-input-label-id' }}
        >
          {availableForms.map(({ id, displayName }, index: number) => (
            <MenuItem key={`menu-item-${index}`} value={id}>
              {displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel
          id="form-select-label-form-type"
          htmlFor={'select-input-label-id-form-type'}
          aria-label={`Select a form type ${
            selectedForm === 'partial'
              ? 'Partial Form selected'
              : selectedForm === 'full'
              ? 'Full Form selected'
              : ''
          }`}
        >
          Form Type
        </InputLabel>

        <Select
          labelId="form-select-label-form-type"
          label={'Form Type'}
          value={selectedForm}
          onChange={(event) => setSelectedForm(event.target.value)}
          role={'listbox'}
          data-testid={'form-select-form-type'}
          inputProps={{ id: 'select-input-label-id-form-type' }}
        >
          <MenuItem key={`menu-item-form-full`} value={'full'}>
            Full Form
          </MenuItem>
          <MenuItem key={`menu-item-form-partial`} value={'partial'}>
            Partial Form
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel
          id="form-select-label-credential-type"
          htmlFor={'select-input-label-id-credential-type'}
          aria-label={`Select a credential type ${
            selectedCredential === 'oa'
              ? 'Open Attestation selected'
              : selectedCredential === 'svip'
              ? 'Silicon Valley Innovation Program selected'
              : ''
          }`}
        >
          Credential Type
        </InputLabel>

        <Select
          labelId="form-select-label-credential-type"
          label={'Credential Type'}
          value={selectedCredential}
          onChange={(event) => setSelectedCredential(event.target.value)}
          role={'listbox'}
          data-testid={'form-select-credential-type'}
          inputProps={{ id: 'select-input-label-id-credential-type' }}
        >
          <MenuItem key={`menu-item-form-oa`} value={'oa'}>
            Open Attestation
          </MenuItem>
          <MenuItem key={`menu-item-form-svip`} value={'svip'}>
            Silicon Valley Innovation Program
          </MenuItem>
        </Select>
      </FormControl>
      <Box
        display={'flex'}
        flexDirection={'row'}
        flexWrap={'wrap'}
        justifyContent="right"
        gap={'15px'}
      >
        <Button
          label="Cancel"
          variant="outlined"
          color="error"
          onClick={goToHome}
        />
        <Button
          label="Next"
          onClick={handleSubmit}
          disabled={isComplete ? false : true}
        />
      </Box>
    </Box>
  );
};
