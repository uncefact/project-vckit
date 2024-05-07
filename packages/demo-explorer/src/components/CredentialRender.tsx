import { ProCard } from '@ant-design/pro-components'
import { QrCodeDocumentWrapper } from '@vckit/react-components'
import {
  Renderer,
  WebRenderingTemplate2022,
  WebRenderingTemplate2024,
} from '@vckit/renderer'
import { useVeramo } from '@veramo-community/veramo-react'
import { VerifiableCredential } from '@veramo/core'
import { Button, Spin, Tabs } from 'antd'
import html2canvas from 'html2canvas'
import { CSSProperties, useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getIssuerDID } from '../utils/did'
import { convertBase64ToString } from '../utils/helpers'
import IdentifierProfile from './IdentifierProfile'

const proCardStyle = {
  minWidth: '100%',
  width: 'fit-content',
}
const jsonStyle: CSSProperties = {
  backgroundColor: 'rgb(247, 248, 252)',
  padding: '0.75rem 1.25rem',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  wordBreak: 'break-all',
}

interface CredentialRenderProps {
  credential: VerifiableCredential
  hash: string
}

interface IRenderDocument{
  type: string;
  renderedTemplate: string;
  id: string | undefined;
  name: string | undefined;
  mediaType: string | undefined;
  
}
const CredentialRender: React.FC<CredentialRenderProps> = ({
  credential,
  hash,
}) => {
  const { agent } = useVeramo()
  const [documents, setDocuments] = useState<IRenderDocument[]>([])
  const [qrCodeValue, setQrCodeValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
    setIsLoading(true)
    try {
      const renderer = new Renderer({
        providers: {
          WebRenderingTemplate2022: new WebRenderingTemplate2022(),
          WebRenderingTemplate2024: new WebRenderingTemplate2024(),
        },
        defaultProvider: 'WebRenderingTemplate2022',
      })

      let { documents }: { documents: IRenderDocument[] } =
        await renderer.renderCredential({
          credential,
        })
      documents = documents.map((doc) => {
        return {
          ...doc,
          renderedTemplate: convertBase64ToString(doc.renderedTemplate),
        }
      })
      setDocuments(documents)
    } catch (e) {}
    setIsLoading(false)
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

  function printdiv() {
    var printWindow = window.open('', '')

    html2canvas(document.getElementById('qrCodeContainer')!)
      .then((canvas: any) => {
        var canvasObj =
          '<img src="' + canvas.toDataURL() + '" style="width:785px"/>'

        printWindow!.document.write('<html>')
        printWindow!.document.write('<body>')
        printWindow!.document.write(canvasObj)
        printWindow!.document.write('</body></html>')
        printWindow!.document.close()
      })
      .then((result) => printWindow?.print())
  }

  return (
    <Spin tip="Loading..." spinning={isLoading || credentialLoading}>
      {!isLoading && !credentialLoading ? (
        documents.length !== 0 ? (
          <Tabs
            items={documents.map((doc, i) => ({
              key: i.toString(),
              label: `${doc.type}`,
              children: (
                <ProCard
                  style={proCardStyle}
                  title={<IdentifierProfile did={getIssuerDID(credential)} />}
                >
                  <QrCodeDocumentWrapper qrCodeValue={qrCodeValue}>
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{ __html: doc.renderedTemplate }}
                    ></div>
                  </QrCodeDocumentWrapper>
                </ProCard>
              ),
            }))}
          />
        ) : (
          <pre style={jsonStyle}>{JSON.stringify(credential, null, 2)}</pre>
        )
      ) : (
        <></>
      )}
    </Spin>
  )
}

export default CredentialRender
