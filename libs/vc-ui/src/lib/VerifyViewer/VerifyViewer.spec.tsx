import { render } from '@testing-library/react';
import { CHAFTA_COO, validResults } from '../fixtures';
import { VerifyViewer } from './VerifyViewer';

describe('VerifyViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VerifyViewer document={CHAFTA_COO} results={validResults} />
    );
    expect(baseElement).toBeTruthy();
  });
});
