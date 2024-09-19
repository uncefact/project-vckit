import React, { useEffect, useState } from 'react'
import { Button, Card, Alert, Spin } from 'antd'
import { issueCredential } from '../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifier } from '@veramo/core'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { VCJSONSchema } from '../types'
import { convertToSchema } from '../utils/dataGenerator'
import { dropFields } from '../utils/helpers'
import { Generate } from '@jsonforms/core'
import { ErrorObject } from 'ajv'

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
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<any>([])
  const [schemaData, setSchemaData] = useState<any>({})
  const [uischema, setUiSchema] = useState<any>({})
  const [additionalErrors, setAdditionalErrors] = useState<ErrorObject[]>([])

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
              title: 'JWT',
            },
            {
              const: 'lds',
              title: 'JSON-LD Signature',
            },
            // {
            //   const: 'EthereumEip712Signature2021',
            //   title: 'EthereumEip712Signature2021',
            // },
            // {
            //   const: 'OpenAttestationMerkleProofSignature2018',
            //   title: 'OpenAttestationMerkleProofSignature2018',
            // },
          ],
        },
        identityProofType: {
          type: 'string',
          oneOf: [
            {
              const: 'DID',
              title: 'DID',
            },
            {
              const: 'DNS-DID',
              title: 'DNS-DID',
            },
            {
              const: 'DNS-TXT',
              title: 'DNS-TXT',
            },
          ],
        },
        identityProofIdentifier: {
          type: 'string',
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

      const uiSchema = Generate.uiSchema(convertedSchema) as any
      const proofTypeUiSchema = uiSchema.elements.find(
        (e: any) => e.scope === '#/properties/identityProofType',
      )
      proofTypeUiSchema.rule = {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/proofFormat',
          schema: { const: 'OpenAttestationMerkleProofSignature2018' },
        },
      }

      const identityProofIdentifierUiSchema = uiSchema.elements.find(
        (e: any) => e.scope === '#/properties/identityProofIdentifier',
      )
      identityProofIdentifierUiSchema.rule = {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/identityProofType',
          schema: { enum: ['DNS-DID', 'DNS-TXT'] },
        },
      }

      setUiSchema(uiSchema)
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
      setSending(true)

      await issueCredential({
        agent,
        issuer: formData.issuer,
        credentialSubject: formData.credentialSubject,
        proofFormat: formData.proofFormat,
        customContext: schema['@context'],
        type: schema.type,
        identityProofType: formData.identityProofType,
        identityProofIdentifier: formData.identityProofIdentifier,
        openAttestationMetadata: schema.openAttestationMetadata,
        version: schema.version,
        issuerProfile: {
          name: schema.issuer.name,
          type: schema.issuer.type,
        },
        additionalFieldsFromSchema: {
          ...dropFields(schema, [
            '@context',
            'type',
            'credentialSubject',
            'id',
            'issuer',
            'issuanceDate',
            'openAttestationMetadata',
          ]),
        },
      })
      setFormData({})
    } catch (err) {
      setErrorMessage(
        'Unable to Issue Credential. Check console log for more info.',
      )
    }
    setSending(false)
  }

  return (
    <Card style={{ maxWidth: '800px' }}>
      <JsonForms
        // @ts-ignore
        schema={schemaData}
        uischema={uischema}
        data={formData}
        renderers={renderers}
        cells={materialCells}
        validationMode={'ValidateAndShow'}
        additionalErrors={additionalErrors}
        onChange={onChange}
      />
      <br />
      <br />
      <Spin spinning={sending}>
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
      </Spin>
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
