import { render } from '@testing-library/react';
import { invalidResults, validResults } from '../fixtures';
import { VerifyResults } from './VerifyResults';

describe('VerifyResults', () => {
  it('should render correctly', () => {
    const { baseElement } = render(
      <VerifyResults {...(validResults as any)} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should display correct checks for a valid document', () => {
    const { getByText } = render(<VerifyResults {...validResults} />);

    getByText('Valid');
    getByText('Issued by:');
    getByText('did:key:123');
    getByText('Document has not been tampered with');
    getByText('Document has not been revoked');
  });

  it('should display correct checks for an invalid document', () => {
    const { getByText } = render(<VerifyResults {...invalidResults} />);

    getByText('Invalid');
    getByText('Document has been tampered with');
  });
});
