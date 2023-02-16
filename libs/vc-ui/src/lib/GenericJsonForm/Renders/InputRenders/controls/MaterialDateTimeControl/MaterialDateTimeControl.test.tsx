import { fireEvent } from '@testing-library/react';
import { MaterialDateTimeControl } from './MaterialDateTimeControl';
import {
  samplePropsInputFields,
  samplePropsInputFieldsRequired,
  jsonFormsTestHarness,
} from '../../../../testUtils';

describe('MaterialDateTimeControl', () => {
  it('should render', () => {
    const mockCallback = jest.fn();
    const { queryAllByText } = jsonFormsTestHarness(
      '',
      <MaterialDateTimeControl
        handleChange={mockCallback}
        {...samplePropsInputFields}
      />
    );
    const title = queryAllByText(samplePropsInputFields.label)[0];
    expect(title).toBeInstanceOf(HTMLElement);
  });

  it('should open calander selector and update on value select', () => {
    const mockCallback = jest.fn();
    const { queryByText, getByTestId, getByRole } = jsonFormsTestHarness(
      '',
      <MaterialDateTimeControl
        handleChange={mockCallback}
        {...samplePropsInputFieldsRequired}
      />
    );

    const calenderImage = getByTestId('CalendarIcon');
    expect(calenderImage).toBeInstanceOf(SVGSVGElement);
    const calenderButton = calenderImage.parentElement;
    expect(calenderButton).toBeInstanceOf(HTMLElement);

    if (calenderButton) fireEvent.click(calenderButton);

    const calandarOverlay = getByRole('grid');
    expect(calandarOverlay).toBeDefined();

    const dayElement = queryByText('15'); //check if overlay shows using arrows
    if (dayElement) fireEvent.click(dayElement);

    const clockOverlay = queryByText('00');
    if (clockOverlay) fireEvent.click(clockOverlay);

    const clockOverlay2 = queryByText('35');
    if (clockOverlay2) fireEvent.click(clockOverlay2);
    expect(mockCallback).toHaveBeenCalled();
  });
});
