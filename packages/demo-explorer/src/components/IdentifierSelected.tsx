import React from 'react'

import { Select, SelectProps, Space } from 'antd'
import { IIdentifier } from '@veramo/core-types'

const IdentifierSelected = ({
  identifiers,
  getIdentifierSelected,
}: {
  identifiers: IIdentifier[]
  getIdentifierSelected: (issuer: string[]) => void
}) => {
  const options: SelectProps['options'] = []
  identifiers?.forEach((identifier) => {
    options.push({
      label: identifier.alias,
      value: identifier.did,
    })
  })

  const handleChange = (value: string[]) => {
    getIdentifierSelected(value)
  }

  return (
    <Space style={{ marginLeft: 10, width: '40%' }} direction="vertical">
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select issuer"
        onChange={handleChange}
        options={options}
      />
    </Space>
  )
}

export default IdentifierSelected
