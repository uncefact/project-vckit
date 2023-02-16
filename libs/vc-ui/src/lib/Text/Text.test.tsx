import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Text>Soopa Doopa</Text>);

    expect(baseElement).toMatchSnapshot();
  });
});
