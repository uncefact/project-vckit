import { DatePicker } from 'antd'
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'
import { RangeValue } from '../types'

export const CustomDatePickerWithDateFns = DatePicker.generatePicker<Date>(
  dateFnsGenerateConfig,
)

interface DateRangePickerProps {
  onChange: (date: RangeValue) => void
  dateFormat?: string
}

const DateRangePicker = ({
  onChange,
  dateFormat = 'yyyy-MM-dd HH:mm:ss.SSS',
}: DateRangePickerProps) => {
  const { RangePicker } = CustomDatePickerWithDateFns

  return (
    <RangePicker
      style={{ marginRight: 20 }}
      format={dateFormat}
      showTime={{ use12Hours: true }}
      onChange={(date) => onChange(date)}
    />
  )
}

export default DateRangePicker
