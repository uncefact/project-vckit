import '@testing-library/jest-dom';
import { getByTestId, queryByTestId, render } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Button label="FooBar" />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should show spinner and hire label when loading', () => {
    const { baseElement, rerender } = render(<Button label="FooBar" />);

    expect(queryByTestId(baseElement, 'button:FooBar:loader')).toBeFalsy();
    expect(getByTestId(baseElement, 'button:FooBar:label')).toHaveStyle(
      'visibility: visible'
    );

    rerender(<Button label="FooBar" loading={true} />);

    expect(queryByTestId(baseElement, 'button:FooBar:loader')).toBeTruthy();
    expect(getByTestId(baseElement, 'button:FooBar:label')).toHaveStyle(
      'visibility: hidden'
    );
  });
});
