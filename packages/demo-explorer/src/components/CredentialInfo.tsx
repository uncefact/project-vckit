import React from 'react'
import { Descriptions } from 'antd'
import { VerifiableCredential } from '@vckit/core'
import { format } from 'date-fns'

interface CredentialInfoProps {
  credential: VerifiableCredential
}

interface TableRow {
  key: string
  value: string
}

const CredentialInfo: React.FC<CredentialInfoProps> = ({ credential }) => {
  if (!credential) return null

  const data: Array<TableRow> = []

  for (const key in credential.credentialSubject) {
    let value = credential.credentialSubject[key]
    value = typeof value === 'string' ? value : JSON.stringify(value)
    data.push({ key, value })
  }

  return (
    <>
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Type">
          {(credential.type as string[]).join(',')}
        </Descriptions.Item>
        <Descriptions.Item label="Context">
          {(credential['@context'] as string[]).join(',')}
        </Descriptions.Item>
        <Descriptions.Item label="Issuer">
          {(credential.issuer as { id: string }).id as string}
        </Descriptions.Item>
        <Descriptions.Item label="Issuance date">
          {format(new Date(credential.issuanceDate), 'PPP')}
        </Descriptions.Item>
        <Descriptions.Item label="Proof type">
          {credential.proof.type}
        </Descriptions.Item>
        <Descriptions.Item label="Id">{credential.id}</Descriptions.Item>
      </Descriptions>

      <br />

      <Descriptions
        bordered
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        {data.map((i) => (
          <Descriptions.Item label={i.key} key={i.key}>
            {i.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </>
  )
}

export default CredentialInfo
