import { ProCard } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo/core'
import IdentifierProfile from './IdentifierProfile'
import { getIssuerDID } from '../utils/did'
import { useVeramo } from '@veramo-community/veramo-react'
import { useEffect, useState } from 'react'
import { convertBase64ToString } from '../utils/helpers'
import { Renderer, WebRenderingTemplate2022 } from '@vckit/renderer'

interface CredentialRenderProps {
  credential: VerifiableCredential
}

const CredentialRender: React.FC<CredentialRenderProps> = ({ credential }) => {
  const { agent } = useVeramo()
  const [documents, setDocuments] = useState<string[]>([])

  const renderer = new Renderer({
    providers: {
      WebRenderingTemplate2022: new WebRenderingTemplate2022(),
    },
    defaultProvider: 'WebRenderingTemplate2022',
  })

  useEffect(() => {
    if (!agent) return
    if (!credential) return

    renderCredential(credential)
  }, [agent, credential])

  const renderCredential = async (credential: VerifiableCredential) => {
    let { documents }: { documents: string[] } =
      await renderer.renderCredential({
        credential,
      })
    documents = documents.map((doc) => convertBase64ToString(doc))

    setDocuments(documents)
  }

  return (
    <ProCard title={<IdentifierProfile did={getIssuerDID(credential)} />}>
      {documents.map((doc, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: doc }}></div>
      ))}
    </ProCard>
  )
}

export default CredentialRender
