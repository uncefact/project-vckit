import { fireEvent, within } from '@testing-library/react';
import { render } from '../../utils';
import { VCOptions } from './VCOptions';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockNavigate = jest.fn();
const handleSubmitMock = jest.fn();

const formMock = {
  schema: {},
  uiSchema: {},
};

const formsMock = [
  {
    id: '001',
    name: 'testForm',
    displayName: 'testForm',
    fullForm: formMock,
    partialForm: formMock,
  },
];

describe('VCOptions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render correctly', () => {
    const { baseElement } = render(
      <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  describe('document type', () => {
    it('should display document types', () => {
      const { getAllByRole } = render(
        <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
      );

      fireEvent.mouseDown(getAllByRole('listbox')[0].children[0]);
      const listbox = within(getAllByRole('listbox')[0]);

      expect(listbox.getByText(formsMock[0].name)).toBeTruthy();
    });

    it('should update the value of the listbox', () => {
      const { getAllByRole } = render(
        <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
      );

      fireEvent.mouseDown(getAllByRole('listbox')[0].children[0]);
      const listbox = within(getAllByRole('listbox')[0]);
      fireEvent.click(listbox.getByText(formsMock[0].name));

      expect(getAllByRole('listbox')[0].querySelector('input')?.value).toBe(
        formsMock[0].id
      );
    });
  });

  describe('form type', () => {
    it('should display form types', () => {
      const { getAllByRole } = render(
        <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
      );

      fireEvent.mouseDown(getAllByRole('listbox')[1].children[0]);
      const listbox = within(getAllByRole('listbox')[0]);

      expect(listbox.getByText('Partial Form')).toBeTruthy();
      expect(listbox.getByText('Full Form')).toBeTruthy();
    });

    it('should update the value of the listbox', () => {
      const { getAllByRole } = render(
        <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
      );

      fireEvent.mouseDown(getAllByRole('listbox')[1].children[0]);
      const listbox = within(getAllByRole('listbox')[0]);
      fireEvent.click(listbox.getByText('Partial Form'));

      expect(getAllByRole('listbox')[1].querySelector('input')?.value).toBe(
        'partial'
      );

      fireEvent.click(listbox.getByText('Full Form'));

      expect(getAllByRole('listbox')[1].querySelector('input')?.value).toBe(
        'full'
      );
    });
  });

  describe('credential type', () => {
    it('should display credential types', () => {
      const { getAllByRole } = render(
        <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
      );

      fireEvent.mouseDown(getAllByRole('listbox')[2].children[0]);
      const listbox = within(getAllByRole('listbox')[0]);

      expect(listbox.getByText('Open Attestation')).toBeTruthy();
      expect(
        listbox.getByText('Silicon Valley Innovation Program')
      ).toBeTruthy();
    });

    it('should update the value of the listbox', () => {
      const { getAllByRole } = render(
        <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
      );

      fireEvent.mouseDown(getAllByRole('listbox')[2].children[0]);
      const listbox = within(getAllByRole('listbox')[0]);
      fireEvent.click(listbox.getByText('Open Attestation'));

      expect(getAllByRole('listbox')[2].querySelector('input')?.value).toBe(
        'oa'
      );

      fireEvent.click(listbox.getByText('Silicon Valley Innovation Program'));

      expect(getAllByRole('listbox')[2].querySelector('input')?.value).toBe(
        'svip'
      );
    });
  });

  it('should display both buttons', () => {
    const { getByText } = render(
      <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
    );

    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  it('should disable the next button if options are not selected', () => {
    const { getByText } = render(
      <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
    );

    expect(getByText('Next').getAttribute('disabled'));
  });

  it('should call the callback function when the user clicks next', () => {
    const { getByText, getAllByRole } = render(
      <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
    );

    fireEvent.mouseDown(getAllByRole('listbox')[0].children[0]);
    const documentListbox = within(getAllByRole('listbox')[0]);
    fireEvent.click(documentListbox.getByText(formsMock[0].name));

    fireEvent.mouseDown(getAllByRole('listbox')[1].children[0]);
    const formListBox = within(getAllByRole('listbox')[0]);
    fireEvent.click(formListBox.getByText('Full Form'));

    fireEvent.mouseDown(getAllByRole('listbox')[2].children[0]);
    const credentialListBox = within(getAllByRole('listbox')[0]);
    fireEvent.click(credentialListBox.getByText('Open Attestation'));

    fireEvent.click(getByText('Next'));

    expect(handleSubmitMock).toBeCalledWith({
      ...formsMock[0],
      formType: 'full',
      credentialType: 'oa',
    });
  });

  it('should go to home when cancel is clicked', () => {
    const { getByText } = render(
      <VCOptions forms={formsMock} onFormSelected={handleSubmitMock} />
    );

    fireEvent.click(getByText('Cancel'));

    expect(mockNavigate).toBeCalledWith('/');
  });
});
