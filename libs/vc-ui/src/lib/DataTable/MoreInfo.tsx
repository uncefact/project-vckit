import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ButtonBase, Menu, MenuItem, Stack } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import React from 'react';

interface IMoreInfo {
  items: { [key: string]: () => void };
  params: GridCellParams;
}

export const MoreInfo = ({ items, params }: IMoreInfo) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      style={{ justifyContent: 'end', marginLeft: 'auto' }}
    >
      <ButtonBase
        onClick={handleClick}
        data-testid={`more-info-menu-button:${params.id}`}
      >
        <MoreVertIcon />
      </ButtonBase>
      <Menu
        id={`basic-menu:${params.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {Object.entries(items).map(([name, handleAction]) => {
          return (
            <MenuItem
              data-testid={`more-info-list-item:${name}`}
              key={name}
              onClick={handleAction}
            >
              {name}
            </MenuItem>
          );
        })}
      </Menu>
    </Stack>
  );
};
