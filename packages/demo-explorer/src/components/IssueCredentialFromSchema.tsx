import React, { useEffect, useState } from 'react'
import { Button, Card, Alert } from 'antd'
import { issueCredential } from '../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifier } from '@veramo/core'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { VCJSONSchema } from '../types'
import { convertToSchema } from '../utils/dataGenerator'
import { dropFields } from '../utils/helpers'

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
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<any>([])
  const [schemaData, setSchemaData] = useState<any>({})

  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  useEffect(() => {
    if (schema && identifiers) {
      const identitierOptions = identifiers.map((id: IIdentifier) => {
        return {
          const: id.did,
          title: id.alias,
        }
      })

      const additionalProperties = {
        proofFormat: {
          type: 'string',
          oneOf: [
            {
              const: 'jwt',
              title: 'jwt',
            },
            {
              const: 'lds',
              title: 'lds',
            },
            {
              const: 'EthereumEip712Signature2021',
              title: 'EthereumEip712Signature2021',
            },
            {
              const: 'OpenAttestationMerkleProofSignature2018',
              title: 'OpenAttestationMerkleProofSignature2018',
            },
          ],
        },
        issuer: {
          type: 'string',
          oneOf: identitierOptions,
        },
      }

      const required = ['issuer', 'proofFormat']

      const convertedSchema: any = convertToSchema({
        credentialSubject: schema.credentialSubject,
      })

      convertedSchema.properties = {
        ...convertedSchema.properties,
        ...additionalProperties,
      }
      convertedSchema.required = required

      setSchemaData(convertedSchema)
      setFormData({
        credentialSubject: schema.credentialSubject,
      })
    }
  }, [schema, identifiers])

  const onChange = ({ errors, data }: { errors: any[]; data: any }) => {
    setFormData(data)
    setErrors([...errors])
  }

  const signVc = async (fields: Field[]) => {
    // @ts-ignore
    console.log(schema['@context'])
    try {
      await issueCredential(
        agent,
        formData.issuer,
        '',
        fields,
        formData.proofFormat,
        // @ts-ignore
        schema['@context'],
        // @ts-ignore
        schema.type,
        '', // id
        // @ts-ignore
        dropFields(schema, [
          '@context',
          'type',
          'credentialSubject',
          'id',
          'issuer',
          'issuanceDate',
        ]),
      )
      setFormData({})
    } catch (err) {
      setErrorMessage(
        'Unable to Issue Credential. Check console log for more info.',
      )
    }
  }

  return (
    <Card style={{ maxWidth: '800px' }}>
      <JsonForms
        // @ts-ignore
        schema={schemaData}
        // uischema={uischema}
        data={formData}
        renderers={renderers}
        cells={materialCells}
        validationMode={'ValidateAndShow'}
        onChange={onChange}
      />
      <br />
      <br />
      <Button
        type="primary"
        onClick={() => {
          setErrorMessage('')
          const fields: Field[] = []
          for (let key in formData.credentialSubject as any) {
            fields.push({
              type: key,
              value: (formData.credentialSubject as any)[key],
            })
          }
          signVc(fields)
        }}
        style={{ marginRight: 5 }}
        disabled={sending || errors.length !== 0}
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
    </Card>
  )
}

export default IssueCredentialFromSchema
