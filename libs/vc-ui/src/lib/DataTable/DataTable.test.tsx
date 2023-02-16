import { GridColDef } from '@mui/x-data-grid';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DataTable } from './DataTable';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
  },
  {
    field: 'firstName',
    headerName: 'First Name',
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
  },
];

const rows = [
  {
    id: '006',
    firstName: 'Postman',
    lastName: 'Pat',
  },
  {
    id: '007',
    firstName: 'Wreck-It',
    lastName: 'Ralph',
  },
];

const mockHandleFunction = jest.fn();

describe('DataTable', () => {
  it('should render correctly', () => {
    const { baseElement } = render(
      <DataTable
        handleAction={mockHandleFunction}
        columns={columns}
        rows={rows}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should display all fields and their values', () => {
    const { getByText } = render(
      <DataTable
        handleAction={mockHandleFunction}
        columns={columns}
        rows={rows}
      />
    );

    getByText('006');
    getByText('Postman');
    getByText('Pat');

    getByText('007');
    getByText('Wreck-It');
    getByText('Ralph');
  });

  it('should display relevant results from search', async () => {
    const { getByPlaceholderText, queryByText } = render(
      <DataTable
        handleAction={mockHandleFunction}
        columns={columns}
        rows={rows}
      />
    );

    expect(queryByText('007')).toBeTruthy();
    expect(queryByText('Wreck-It')).toBeTruthy();
    expect(queryByText('Ralph')).toBeTruthy();

    const searchBar = getByPlaceholderText('Search…');

    fireEvent.change(searchBar, { target: { value: '006' } });

    await waitFor(() => {
      expect(queryByText('007')).toBeFalsy();
      expect(queryByText('Wreck-It')).toBeFalsy();
      expect(queryByText('Ralph')).toBeFalsy();
    });
  });
});
