import { Typography, TypographyProps } from '@mui/material';
import React from 'react';

export const Text = React.forwardRef<HTMLElement, TypographyProps>(
  ({ children, variant = 'body2', ...rest }, ref) => {
    return (
      <Typography variant={variant} tabIndex={0} {...rest} ref={ref}>
        {children}
      </Typography>
    );
  }
);
