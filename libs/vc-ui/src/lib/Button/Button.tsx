import {
  Button as MUIButton,
  ButtonProps,
  CircularProgress,
  Stack,
  TypographyProps,
} from '@mui/material';
import React from 'react';
import { Text } from '../Text';

export interface IButton extends ButtonProps {
  label: string;
  textProps?: TypographyProps;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, IButton>(
  (
    {
      label,
      textProps,
      variant = 'contained',
      color = 'primary',
      loading = false,
      leftIcon,
      rightIcon,
      ...rest
    },
    ref
  ) => {
    return (
      <MUIButton
        variant={variant}
        color={color}
        data-testid={`button:${label}`}
        {...rest}
        disabled={loading || rest.disabled}
        sx={{
          textTransform: 'none',
          padding: '8px 22px',
          width: 'fit-content',
          zIndex: 10,
          ...rest.sx,
        }}
        ref={ref}
      >
        {loading ? (
          <CircularProgress
            data-testid={`button:${label}:loader`}
            size="16px"
            sx={{ position: 'absolute' }}
            color={variant === 'contained' ? 'inherit' : color}
          />
        ) : null}
        {/* In order to maintain the size of the button when loader appears
      we set the label to be hidden
      */}
        <Stack
          visibility={loading ? 'hidden' : 'visible'}
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing="4px"
        >
          {leftIcon}
          <Text {...textProps} data-testid={`button:${label}:label`}>
            {label}
          </Text>
          {rightIcon}
        </Stack>
      </MUIButton>
    );
  }
);
