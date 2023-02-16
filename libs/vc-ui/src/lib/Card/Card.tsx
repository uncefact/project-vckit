import {
  Card as MUICard,
  CardActions,
  CardContent,
  CardProps,
  Stack,
} from '@mui/material';
import { Button, Text } from '..';

interface ICard extends CardProps {
  name: string;
  text: string;
  actionLabel?: string;
  handleAction?: () => void;
  headerAction?: React.ReactNode;
}

export const Card = ({
  name,
  text,
  handleAction,
  actionLabel,
  headerAction,
  ...rest
}: ICard) => {
  return (
    <MUICard sx={{ width: '320px' }} elevation={1} {...rest}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontWeight="bold" variant="body1">
            {name}
          </Text>
          {headerAction}
        </Stack>

        <Text paddingTop="16px">{text}</Text>
      </CardContent>
      {actionLabel && handleAction && (
        <CardActions>
          <Button
            variant="text"
            color="error"
            label={actionLabel}
            onClick={handleAction}
            sx={{ paddingLeft: 0 }}
            textProps={{
              fontSize: 'small',
              fontWeight: 'bold',
              sx: { textDecoration: 'underline' },
            }}
          />
        </CardActions>
      )}
    </MUICard>
  );
};
