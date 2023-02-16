import { Switch } from '@mui/material';
import { fireEvent, render } from '@testing-library/react';
import { Card } from './Card';

const mockHandleAction = jest.fn();

describe('Card', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { baseElement } = render(
      <Card
        name="Bob the Builder"
        text="Can we fix it?"
        handleAction={mockHandleAction}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call correct function when item is clicked', () => {
    const { getByTestId } = render(
      <Card
        name="Bob the Builder"
        text="Can we fix it?"
        actionLabel="Remove"
        handleAction={mockHandleAction}
      />
    );

    fireEvent.click(getByTestId('button:Remove'));

    expect(mockHandleAction).toHaveBeenCalled();
  });

  it('should show header action if present', () => {
    const { getByTestId } = render(
      <Card
        name="Bob the Builder"
        text="Can we fix it?"
        headerAction={
          <Switch onClick={mockHandleAction} data-testid="switch" />
        }
      />
    );

    fireEvent.click(getByTestId('switch'));

    expect(mockHandleAction).toHaveBeenCalled();
  });
});
