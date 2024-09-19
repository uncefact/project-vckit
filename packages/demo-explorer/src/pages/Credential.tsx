import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

import '@veramo-community/react-components/dist/cjs/index.css'
import { PageContainer } from '@ant-design/pro-components'
import CredentialTabs from '../components/CredentialTabs'

const Credential = () => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()

  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id }),
  )

  return (
    <PageContainer title="Verifiable Credential">
      {!credentialLoading && id && (
        <CredentialTabs credential={credential} hash={id} />
      )}
    </PageContainer>
  )
}

export default Credential
