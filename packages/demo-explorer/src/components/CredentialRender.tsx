import { ProCard } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo/core'
import IdentifierProfile from './IdentifierProfile'
import { getIssuerDID } from '../utils/did'
import { useCallback, useEffect, useState } from 'react'
import { convertBase64ToString } from '../utils/helpers'
import { Renderer, WebRenderingTemplate2022 } from '@vckit/renderer'
import { QrCodeDocumentWrapper } from '@vckit/react-components'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

interface CredentialRenderProps {
  credential: VerifiableCredential
  hash: string
}

const CredentialRender: React.FC<CredentialRenderProps> = ({
  credential,
  hash,
}) => {
  const { agent } = useVeramo()
  const [documents, setDocuments] = useState<string[]>([])
  const [qrCodeValue, setQrCodeValue] = useState<string>('')
  const encryptedEndpoint = process.env.REACT_APP_ENCRYPTED_ENDPOINT
  const qrCodeVerifyEndpoint = process.env.REACT_APP_QRCODE_VERIFY_ENDPOINT

  const { data: encryptedCredentialData, isLoading: credentialLoading } =
    useQuery(['encryptedCredentialData', { hash }], () => {
      return agent?.fetchEncryptedDataByCredentialHash({ credentialHash: hash })
    })

  const inititalQrCodeValue = useCallback(() => {
    const id = encryptedCredentialData.encryptedDataId
    const uri = `${encryptedEndpoint}/${id}`
    const decryptedKey = encryptedCredentialData.decryptedKey
    const payload = { uri, decryptedKey }
    const encodedUrlPayload = encodeURIComponent(JSON.stringify({ payload }))
    const url = `${qrCodeVerifyEndpoint}?q=${encodedUrlPayload}`
    setQrCodeValue(url)
  }, [encryptedCredentialData, encryptedEndpoint, qrCodeVerifyEndpoint])

  const renderCredential = useCallback(async () => {
    const renderer = new Renderer({
      providers: {
        WebRenderingTemplate2022: new WebRenderingTemplate2022(),
      },
      defaultProvider: 'WebRenderingTemplate2022',
    })

    let { documents }: { documents: string[] } =
      await renderer.renderCredential({
        credential,
      })
    documents = documents.map((doc) => convertBase64ToString(doc))

    setDocuments(documents)
  }, [credential])

  useEffect(() => {
    renderCredential()
  }, [renderCredential])

  useEffect(() => {
    if (
      documents.length === 0 ||
      credentialLoading ||
      !encryptedCredentialData
    ) {
      return
    }
    inititalQrCodeValue()
  }, [
    credentialLoading,
    encryptedCredentialData,
    documents,
    inititalQrCodeValue,
  ])

  return (
    <ProCard title={<IdentifierProfile did={getIssuerDID(credential)} />}>
      <QrCodeDocumentWrapper qrCodeValue={qrCodeValue}>
        {documents.map((doc, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: doc }}></div>
        ))}
      </QrCodeDocumentWrapper>
    </ProCard>
  )
}

export default CredentialRender
