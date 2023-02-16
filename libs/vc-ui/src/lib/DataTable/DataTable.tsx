import AddIcon from '@mui/icons-material/Add';
import { Box, BoxProps, Stack } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Button } from '..';

const SimpleFilter = ({
  label,
  handleAction,
}: {
  label: string;
  handleAction: () => void;
}) => {
  return (
    <Stack
      padding="16px"
      direction={{ xs: 'column', sm: 'row' }}
      spacing="16px"
      justifyContent="space-between"
    >
      <GridToolbarQuickFilter />

      {label && handleAction && (
        <Button
          color="error"
          label={label}
          leftIcon={<AddIcon />}
          onClick={handleAction}
          style={{ marginLeft: 'auto' }}
        />
      )}
    </Stack>
  );
};

interface IDataTable extends DataGridProps {
  handleAction?: () => void;
  toolBarActionLabel?: string;
  containerProps?: BoxProps;
}

export const DataTable = ({
  handleAction,
  toolBarActionLabel,
  containerProps,
  ...rest
}: IDataTable) => {
  return (
    <Box style={{ height: 400, width: '100%' }} {...containerProps}>
      <DataGrid
        components={{
          Toolbar: SimpleFilter,
        }}
        componentsProps={{
          toolbar: { handleAction, label: toolBarActionLabel },
        }}
        {...rest}
      />
    </Box>
  );
};
