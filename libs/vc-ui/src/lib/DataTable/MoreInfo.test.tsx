import { GridCellParams } from '@mui/x-data-grid';
import { fireEvent, render } from '@testing-library/react';
import { MoreInfo } from './MoreInfo';

const mockViewFunction = jest.fn();
const mockDownloadFunction = jest.fn();
describe('MoreInfo', () => {
  it('should render correctly', () => {
    const { baseElement } = render(
      <MoreInfo
        params={{ id: 'test' } as GridCellParams}
        items={{ View: mockViewFunction, Download: mockDownloadFunction }}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should show correct items when clicked', () => {
    const { getByText, getByTestId, queryByText } = render(
      <MoreInfo
        params={{ id: 'test' } as GridCellParams}
        items={{ View: mockViewFunction, Download: mockDownloadFunction }}
      />
    );

    expect(queryByText('View')).toBeFalsy();
    expect(queryByText('Download')).toBeFalsy();

    fireEvent.click(getByTestId('more-info-menu-button:test'));

    getByText('View');
    getByText('Download');
  });

  it('should call correct function when item is clicked', () => {
    const { getByTestId } = render(
      <MoreInfo
        params={{ id: 'test' } as GridCellParams}
        items={{ View: mockViewFunction, Download: mockDownloadFunction }}
      />
    );

    fireEvent.click(getByTestId('more-info-menu-button:test'));

    fireEvent.click(getByTestId('more-info-list-item:View'));

    expect(mockViewFunction).toHaveBeenCalled();

    fireEvent.click(getByTestId('more-info-list-item:Download'));

    expect(mockDownloadFunction).toHaveBeenCalled();
  });
});
