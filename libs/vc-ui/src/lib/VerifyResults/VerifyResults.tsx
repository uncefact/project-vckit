import CheckCircleOutlineOutlined from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Stack } from '@mui/material';
import React from 'react';
import { Text } from '../Text';
import { Issuer, VerifyResult } from '../VerifyViewer';

export interface IVerificationResults {
  issuer: Issuer;
  result: string[];
}

export type CHECK_TYPE = 'proof' | 'status';

export type CheckObject = {
  type: CHECK_TYPE;
  validText: string;
  invalidText: string;
};

export const CHECKS_INFO: CheckObject[] = [
  {
    type: 'proof',
    validText: 'Document has not been tampered with',
    invalidText: 'Document has been tampered with',
  },
  {
    type: 'status',
    validText: 'Document has not been revoked',
    invalidText: 'Document has been revoked',
  },
];

export interface IValid {
  issuer: Issuer;
  checks: CHECK_TYPE[];
  errors: CHECK_TYPE[];
}

export const getCheckStatus = (check: CHECK_TYPE, errors: CHECK_TYPE[]) => {
  const item = CHECKS_INFO.filter((item) => item['type'] === check);

  if (item.length !== 1) {
    return null;
  }

  return errors.includes(item[0].type)
    ? {
        isValid: false,
        text: item[0].invalidText,
      }
    : {
        isValid: true,
        text: item[0].validText,
      };
};

export const displayCheckResults = (
  checks: CHECK_TYPE[],
  errors: CHECK_TYPE[]
) => {
  return (
    <>
      {checks.map((check) => {
        const checkObject = getCheckStatus(check, errors);

        return (
          checkObject && (
            <Box
              alignItems="center"
              display="flex"
              key={check}
              data-testid={check}
            >
              {checkObject.isValid ? (
                <CheckCircleOutlineOutlined color="success" />
              ) : (
                <CancelOutlinedIcon color="error" />
              )}

              <Text
                variant="body1"
                fontWeight={400}
                fontStyle="italic"
                display="inline"
                paddingLeft="12px"
              >
                {checkObject.text}
              </Text>
            </Box>
          )
        );
      })}
    </>
  );
};

export const Results = ({ issuer, checks, errors }: IValid) => {
  const hasErrors = errors.length !== 0;
  const statusText = hasErrors ? 'Invalid' : 'Valid';

  return (
    <React.Fragment>
      <Box
        bgcolor={hasErrors ? '#dc3545' : '#28a745'}
        borderRadius="3px"
        display="inline-flex"
        data-testid="valid-box"
        marginBottom="36px"
      >
        <Text
          color="white"
          fontWeight="bold"
          variant="h5"
          padding="8px 16px"
          aria-label={`Document is ${statusText}`}
        >
          {statusText}
        </Text>
      </Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: '16px', md: '64px' }}
      >
        {/* Only show issuer if VC is valid */}
        {!hasErrors && (
          <Box>
            <Text variant="h6">Issued by:</Text>
            <Text
              fontWeight="bold"
              variant="h6"
              style={{ wordWrap: 'break-word' }}
            >
              {issuer.id}
            </Text>
          </Box>
        )}

        {displayCheckResults(checks, errors)}
      </Stack>
    </React.Fragment>
  );
};

export const VerifyResults = ({ issuer, checks, errors }: VerifyResult) => {
  return (
    <Results
      issuer={issuer}
      checks={checks as CHECK_TYPE[]}
      errors={errors as CHECK_TYPE[]}
    />
  );
};
