import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Descriptions, Spin } from 'antd'
import { VerifiableCredential } from '@veramo/core'
import { format } from 'date-fns'
import { useVeramo } from '@veramo-community/veramo-react'
import { DocumentFormat, detectDocumentType } from '../utils/helpers'

interface CredentialInfoProps {
  credential: VerifiableCredential
  hash: string
}

interface TableRow {
  key: string
  value: string
}

const CredentialInfo: React.FC<CredentialInfoProps> = ({
  credential,
  hash,
}) => {
  const { agent } = useVeramo()
  const [credentialData] = useState<any>(credential)
  const [data, setData] = useState<Array<TableRow>>([])
  const [loading, setLoading] = useState(false)
  const [revoked, setRevoked] = useState(false)
  const [errorMessage, setErrorMessage] = useState<null | string>()
  const [proofFormat, setProofFormat] = useState<DocumentFormat | null>(null)

  const fetchVCStatus = useCallback(async () => {
    setLoading(true)
    await checkVCStatus({ hash })
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])

  useEffect(() => {
    setData([])
    for (const key in credentialData.credentialSubject) {
      let value = credentialData.credentialSubject[key]
      value = typeof value === 'string' ? value : JSON.stringify(value)
      setData((d) => [...d, { key, value }])
    }
    const documentType = detectDocumentType(credentialData)
    setProofFormat(documentType)
    if (
      documentType === DocumentFormat.JWT ||
      documentType === DocumentFormat.JSONLD
    ) {
      fetchVCStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentialData])

  if (!credential || !hash) return null

  const revoke = async () => {
    setLoading(true)
    try {
      const { revoked: vcRevoked } = await agent?.revokeCredential({ hash })
      setRevoked(vcRevoked || false)
    } catch (e: any) {
      console.log(e)
      setErrorMessage(e.message + ' Please refresh the page and try again.')
    }
    setLoading(false)
  }

  const activate = async () => {
    setLoading(true)
    try {
      const { revoked: vcRevoked } = await agent?.activateCredential({ hash })
      setRevoked(vcRevoked || false)
    } catch (e: any) {
      console.log(e)
      setErrorMessage(e.message + ' Please refresh the page and try again.')
    }
    setLoading(false)
  }

  const checkVCStatus = async (args: { hash: string }) => {
    const { revoked: vcRevoked } = await agent?.checkStatus(args)

    setRevoked(vcRevoked || false)
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <>
        <Descriptions
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Type">
            {(credentialData.type as string[]).join(',')}
          </Descriptions.Item>
          <Descriptions.Item label="Context">
            {(credentialData['@context'] as string[]).join(',')}
          </Descriptions.Item>
          <Descriptions.Item label="Issuer">
            {(credentialData.issuer as { id: string }).id as string}
          </Descriptions.Item>
          <Descriptions.Item label="Issuance date">
            {format(new Date(credentialData.issuanceDate), 'PPP')}
          </Descriptions.Item>
          <Descriptions.Item label="Proof type">
            {credentialData.proof.type}
          </Descriptions.Item>
          <Descriptions.Item label="Id">{credentialData.id}</Descriptions.Item>
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
          {proofFormat === DocumentFormat.JWT ||
          proofFormat === DocumentFormat.JSONLD ? (
            <Descriptions.Item label="Status">
              {revoked ? 'Revoked' : 'Active'}
            </Descriptions.Item>
          ) : null}
        </Descriptions>
        <br />
        {proofFormat === DocumentFormat.JWT ||
        proofFormat === DocumentFormat.JSONLD ? (
          revoked ? (
            <Button
              type="primary"
              onClick={() => {
                activate()
              }}
              disabled={loading}
            >
              Unrevoke
            </Button>
          ) : (
            <Button
              danger
              type="primary"
              onClick={() => {
                revoke()
              }}
              disabled={loading}
            >
              Revoke
            </Button>
          )
        ) : null}
        {errorMessage && (
          <>
            <br />
            <br />
            <Alert message={errorMessage} type="error" />
          </>
        )}
      </>
    </Spin>
  )
}

export default CredentialInfo
