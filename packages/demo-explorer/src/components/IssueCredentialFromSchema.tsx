import React, { useState } from 'react'
import { Button, Select, Card, Alert } from 'antd'
import { issueCredential } from '../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifier } from '@veramo/core'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { withTheme } from '@rjsf/core'
import { Theme as AntDTheme } from '@rjsf/antd'
import validator from '@rjsf/validator-ajv8'
import { VCJSONSchema } from '../types'
import DIDDiscoveryBar from './DIDDiscoveryBar'

// const JsonSchemaForm = withTheme(AntDTheme)

const { Option } = Select

const renderers = [
  ...materialRenderers,
  //register custom renderers
]

interface Field {
  type: string
  value: any
}

interface IssueCredentialFromSchemaProps {
  schema: VCJSONSchema
}

const IssueCredentialFromSchema: React.FC<IssueCredentialFromSchemaProps> = ({
  schema,
}) => {
  const { agent } = useVeramo()
  const [errorMessage, setErrorMessage] = useState<null | string>()
  const [sending] = useState(false)
  const [issuer, setIssuer] = useState<string>('')
  const [subject, setSubject] = useState<string>()
  const [formData, setFormData] = useState<any>({})
  const [proofFormat, setProofFormat] = useState('jwt')

  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const signVc = async (fields: Field[]) => {
    // @ts-ignore
    console.log(schema['@context'])
    try {
      await issueCredential(
        agent,
        issuer,
        subject,
        fields,
        proofFormat,
        // @ts-ignore
        schema['@context'],
        // @ts-ignore
        schema.type,
        '', // id
        // @ts-ignore
        schema.openAttestationMetadata,
      )
      setIssuer('')
      setSubject('')
      setFormData({})
    } catch (err) {
      console.error('signVC Error: ', err)
      setErrorMessage(
        'Unable to Issue Credential. Check console log for more info.',
      )
    }
  }

  return (
    <Card style={{ maxWidth: '800px' }}>
      <JsonForms
        // @ts-ignore
        // schema={schema}
        // uischema={uischema}
        data={schema.credentialSubject}
        renderers={renderers}
        cells={materialCells}
        onChange={({ errors, data }) => setFormData(data)}
      />

      {/* <JsonSchemaForm
        schema={schema.schema}
        validator={validator}
        formData={formData}
        onChange={(e) => {
          setFormData(e.formData)
        }}
        onError={() => {}}
      > */}
      <DIDDiscoveryBar
        handleSelect={(e: any) => {
          setSubject(e)
        }}
        placeholder="Subject DID"
      />
      <Select
        style={{ width: '60%' }}
        loading={identifiersLoading}
        onChange={(e) => setIssuer(e as string)}
        placeholder="issuer DID"
        defaultActiveFirstOption={true}
      >
        {identifiers &&
          identifiers.map((id: IIdentifier) => (
            <Option key={id.did} value={id.did as string}>
              {id.did}
            </Option>
          ))}
      </Select>
      <br />
      <Select
        onChange={(e) => setProofFormat(e as string)}
        placeholder="Proof type"
        defaultActiveFirstOption={true}
        style={{ minWidth: '240px' }}
      >
        <Option key="jwt" value="jwt">
          jwt
        </Option>
        <Option key="lds" value="lds">
          lds
        </Option>
        <Option
          key="EthereumEip712Signature2021lds"
          value="EthereumEip712Signature2021"
        >
          EthereumEip712Signature2021
        </Option>
        <Option
          key="OpenAttestationMerkleProofSignature2018"
          value="OpenAttestationMerkleProofSignature2018"
        >
          OpenAttestationMerkleProofSignature2018
        </Option>
      </Select>

      <br />
      <br />

      <Button
        type="primary"
        onClick={() => {
          setErrorMessage('')
          const fields: Field[] = []
          for (let key in formData as any) {
            fields.push({ type: key, value: (formData as any)[key] })
          }
          signVc(fields)
        }}
        style={{ marginRight: 5 }}
        disabled={sending || !subject || !issuer || !proofFormat}
      >
        Issue
      </Button>
      {errorMessage && (
        <>
          <br />
          <br />
          <Alert message={errorMessage} type="error" />
        </>
      )}
      {/* </JsonSchemaForm> */}
    </Card>
  )
}

export default IssueCredentialFromSchema
