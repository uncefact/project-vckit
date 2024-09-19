import React from 'react'

import { useQuery } from 'react-query'
import { Select, SelectProps, Space } from 'antd'
import { IDIDManager } from '@veramo/core-types'
import { useVeramo } from '@veramo-community/veramo-react'

interface IdentifierSelectorProps {
  onChange: (issuer: string[]) => void
}

const IdentifierSelector = ({ onChange }: IdentifierSelectorProps) => {
  const { agent } = useVeramo<IDIDManager>()

  /**
   * Get all identifiers from the agent
   */
  const { data: identifiers } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  return (
    <Space style={{ width: '40%' }} direction="vertical">
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select issuer"
        onChange={onChange}
        options={identifiers?.map((identifier) => {
          return {
            label: identifier.alias,
            value: identifier.did,
          }
        })}
      />
    </Space>
  )
}

export default IdentifierSelector
