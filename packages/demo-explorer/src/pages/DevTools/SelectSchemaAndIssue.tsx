import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { VCJSONSchema } from '../../types'
import IssueCredentialFromSchema from '../../components/IssueCredentialFromSchema'
import { PageContainer } from '@ant-design/pro-components'
import { credentialsIssueExamples } from '@vckit/example-documents'

const { Option } = Select

const credentialExampleList = Object.keys(credentialsIssueExamples)

const SelectSchemaAndIssue: React.FC = () => {
  const [selectedSchemaUrl, setSelectedSchemaUrl] = useState<string>('')
  const [selectedSchema, setSelectedSchema] = useState<VCJSONSchema>()

  // load selected schema
  useEffect(() => {
    const getSchemas = async () => {
      if (selectedSchemaUrl) {
        // @ts-ignore FIXME
        const example = credentialsIssueExamples[selectedSchemaUrl]
        const examplePayload = JSON.parse(example.value)
        setSelectedSchema(examplePayload.credential)
      }
    }
    getSchemas()
  }, [selectedSchemaUrl])

  return (
    <PageContainer>
      <Select
        style={{ width: '60%' }}
        onChange={(e) => setSelectedSchemaUrl(e as string)}
        placeholder="Sample Document"
        defaultActiveFirstOption={true}
      >
        {credentialExampleList &&
          credentialExampleList.map((schema: string) => (
            <Option key={schema} value={schema}>
              {schema}
            </Option>
          ))}
      </Select>
      {selectedSchema && <IssueCredentialFromSchema schema={selectedSchema} />}
    </PageContainer>
  )
}

export default SelectSchemaAndIssue
