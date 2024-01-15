import { IDIDManager, TAgent } from '@veramo/core'
import { ICredentialIssuer } from '@veramo/credential-w3c'
import { ISelectiveDisclosure } from '@veramo/selective-disclosure'
import { JSONSchema7 } from 'json-schema'
import CustomDatePickerWithDateFns from '../components/DatePicker'

export type ConfiguredAgent = TAgent<
  ICredentialIssuer & IDIDManager & ISelectiveDisclosure
>

export interface VCJSONSchema {
  id: string
  name: string
  schema: JSONSchema7

  [key: string]: any
}

export type RangeValue = Parameters<
  NonNullable<
    React.ComponentProps<
      typeof CustomDatePickerWithDateFns.RangePicker
    >['onChange']
  >
>[0]
