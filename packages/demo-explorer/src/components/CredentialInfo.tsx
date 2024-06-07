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
      checkVCStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentialData])

  const isAvailableCredentialStatus = useCallback(() => {
    return (
      (proofFormat === DocumentFormat.JWT ||
        proofFormat === DocumentFormat.JSONLD) &&
      credentialData.credentialStatus &&
      ((credentialData.credentialStatus.type === 'RevocationList2020Status' &&
        hash) ||
        credentialData.credentialStatus.type === 'BitstringStatusListEntry')
    )
  }, [proofFormat, credentialData, hash])

  const revoke = async () => {
    setLoading(true)
    try {
      let vcRevoked = false
      if (
        credentialData?.credentialStatus?.type === 'RevocationList2020Status'
      ) {
        const { revoked } = await agent?.revokeCredential({ hash })
        vcRevoked = revoked
      }
      if (
        credentialData?.credentialStatus?.type === 'BitstringStatusListEntry'
      ) {
        const revoked = await setBitstringStatus(true)
        vcRevoked = revoked
      }

      setRevoked(vcRevoked)
    } catch (e: any) {
      console.log(e)
      setErrorMessage(e.message + ' Please refresh the page and try again.')
    } finally {
      setLoading(false)
    }
  }

  const activate = async () => {
    setLoading(true)
    try {
      let vcRevoked = false
      if (
        credentialData?.credentialStatus?.type === 'RevocationList2020Status'
      ) {
        const { revoked } = await agent?.activateCredential({ hash })
        vcRevoked = revoked
      }
      if (
        credentialData?.credentialStatus?.type === 'BitstringStatusListEntry'
      ) {
        const revoked = await setBitstringStatus(false)
        vcRevoked = revoked
      }

      setRevoked(vcRevoked)
    } catch (e: any) {
      console.log(e)
      setErrorMessage(e.message + ' Please refresh the page and try again.')
    } finally {
      setLoading(false)
    }
  }

  const checkVCStatus = async () => {
    setLoading(true)
    try {
      let vcRevoked = false
      if (
        credentialData?.credentialStatus?.type === 'RevocationList2020Status' &&
        hash
      ) {
        const { revoked } = await agent?.checkRevocationStatus({ hash })
        vcRevoked = revoked
      }
      if (
        credentialData?.credentialStatus?.type === 'BitstringStatusListEntry'
      ) {
        const { revoked } = await agent?.checkBitstringStatus({
          verifiableCredential: credentialData,
        })
        vcRevoked = revoked
      }

      setRevoked(vcRevoked)
    } catch (e: any) {
      console.log(e)
      setErrorMessage(e.message + ' Please refresh the page and try again.')
    } finally {
      setLoading(false)
    }
  }

  const setBitstringStatus = async (bitstringStatus: boolean) => {
    const payload = {
      statusListCredential:
        credentialData.credentialStatus?.statusListCredential,
      statusListVCIssuer: credentialData.issuer?.id || credentialData.issuer,
      statusPurpose:
        credentialData.credentialStatus?.statusPurpose || 'revocation',
      index: credentialData.credentialStatus?.statusListIndex || 0,
      status: bitstringStatus,
    }

    const { status } = await agent?.setBitstringStatus(payload)
    return status
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
          {isAvailableCredentialStatus() ? (
            <Descriptions.Item label="Status">
              {revoked ? 'Revoked' : 'Active'}
            </Descriptions.Item>
          ) : null}
        </Descriptions>
        <br />
        {isAvailableCredentialStatus() ? (
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
