import React, { useState } from 'react'
import { Input, AutoComplete } from 'antd'
import { useChat } from '../context/ChatProvider'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDDiscovery } from '@veramo/did-discovery'
import { SelectProps } from 'antd/es/select'
import { shortId } from '../utils/did'

interface DIDDiscoveryBarProps {
  handleSelect: any
  placeholder?: string
}

const DIDDiscoveryBar: React.FC<DIDDiscoveryBarProps> = ({
  handleSelect,
  placeholder,
}) => {
  const { agent } = useVeramo<IDIDDiscovery>()
  const { newRecipient } = useChat()
  const [options, setOptions] = useState<SelectProps<object>['options']>([])

  const searchResult = async (query: string) => {
    const response = await agent?.discoverDid({ query })
    console.log('response: ', response)
    const selectOptions: Array<{ value: string; label: any }> = []
    response?.results.forEach((r) => {
      r.matches.forEach((m) => {
        selectOptions.push({
          value: m.did,
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{shortId(m.did)}</span>
              <span>{r.provider}</span>
            </div>
          ),
        })
      })
    })
    return selectOptions
  }

  const handleSearch = async (value: string) => {
    setOptions(value ? await searchResult(value) : [])
  }

  return (
    <AutoComplete
      dropdownMatchSelectWidth={true}
      style={{ width: '100%', paddingRight: 20 }}
      options={options}
      onSelect={handleSelect}
      onSearch={handleSearch}
    >
      <Input
        value={newRecipient}
        onChange={(e) => handleSelect(e.target.value)}
        style={{
          flex: 1,
          paddingTop: 10,
          paddingBottom: 10,
        }}
        placeholder={placeholder}
      />
    </AutoComplete>
  )
}

export default DIDDiscoveryBar
