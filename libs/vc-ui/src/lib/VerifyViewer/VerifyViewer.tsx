import {
  OAVerifiableCredential,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import { Paper } from '@mui/material';
import { RendererViewer, VerifyResults } from '../';

export interface Issuer {
  id: string;
}

export interface VerifyResult {
  checks: string[];
  warnings: string[];
  errors: string[];
  issuer: Issuer;
}

export interface IVerifyViewer {
  document: VerifiableCredential | OAVerifiableCredential;
  results: VerifyResult;
  hideVerifyResults?: boolean;
}

export const VerifyViewer = ({
  document,
  results,
  hideVerifyResults,
}: IVerifyViewer) => {
  return (
    <Paper
      sx={{
        padding: { xs: '8px', md: '22px' },
      }}
    >
      {!hideVerifyResults && <VerifyResults {...results} />}
      {!results?.errors?.length && <RendererViewer document={document} />}
    </Paper>
  );
};
