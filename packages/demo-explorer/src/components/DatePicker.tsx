import { DatePicker } from 'antd'
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'

const CustomDatePickerWithDateFns = DatePicker.generatePicker<Date>(dateFnsGenerateConfig)

export default CustomDatePickerWithDateFns
