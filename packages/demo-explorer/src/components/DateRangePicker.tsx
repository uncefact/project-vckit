import { DatePicker } from 'antd'
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'
import { RangeValue } from '../types'

export const CustomDatePickerWithDateFns = DatePicker.generatePicker<Date>(
  dateFnsGenerateConfig,
)

const DateRangePicker = ({
  dateFormat,
  getFilterValue: getRangePickerValue,
}: {
  dateFormat: string
  getFilterValue: (date: RangeValue) => void
}) => {
  const { RangePicker } = CustomDatePickerWithDateFns

  return (
    <RangePicker
      format={dateFormat}
      showTime={{ use12Hours: true }}
      onChange={(date) => getRangePickerValue(date)}
    />
  )
}

export default DateRangePicker
