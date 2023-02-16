import { FunctionComponent } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Link, Typography, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { rankWith, optionIs, ControlProps } from '@jsonforms/core';
import { MuiInputText } from '../../mui-controls/MuiInputText';
import { MaterialInputControl } from '../MaterialInputControl';

export const AbnWidgetControl: FunctionComponent<ControlProps> = (props) => {
  const searchLink: string =
    props?.uischema?.options?.['widgetLink'] ?? 'https://abr.business.gov.au/';
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginBottom: '0.4rem',
      }}
    >
      <Box
        sx={{
          minWidth: { xs: '100%', sm: '370px' },
          flexGrow: 1,
        }}
      >
        <MaterialInputControl {...props} input={MuiInputText} />
      </Box>
      <Link
        sx={{
          paddingTop: { xs: '5px', sm: '15px' },
          paddingLeft: { xs: '5px', sm: '20px' },
          flexGrow: 0.5,
        }}
        href={searchLink}
        target="_blank"
      >
        <Typography display={'inline'}>ABN Search</Typography>
        <OpenInNewIcon
          fontSize="small"
          sx={{ position: 'absolute', margin: '2px 0px 0px 2px' }}
        />
      </Link>
    </Box>
  );
};

export const abnWidgetControlTester = rankWith(2, optionIs('widget', 'ABN'));

export default withJsonFormsControlProps(AbnWidgetControl);
