import { Dropdown, notification } from 'antd'
import React from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { useNavigate } from 'react-router-dom'
import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { IDataStore, VerifiableCredential } from '@veramo/core'
import { getIssuerDID } from '../utils/did'

const CredentialActionsDropdown: React.FC<{
  children: React.ReactNode
  credential: VerifiableCredential
}> = ({ children, credential }) => {
  const { agents, getAgent } = useVeramo<IDataStore>()
  const navigate = useNavigate()

  const agentsToCopyTo = agents.filter((agent) =>
    agent.availableMethods().includes('dataStoreSaveVerifiableCredential'),
  )

  const handleCopyTo = async (agentId: string) => {
    const agent = getAgent(agentId)
    try {
      await agent.dataStoreSaveVerifiableCredential({
        verifiableCredential: credential,
      })
      notification.success({
        message: 'Credential copied to: ' + agent.context.name,
      })
    } catch (e: any) {
      notification.error({
        message: 'Error copying credential to: ' + agent.context.name,
        description: e.message,
      })
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(credential, null, 2)], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = 'verifiable-credential.json'
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'issuer',
            label: 'Issuer',
            icon: <InfoCircleOutlined />,
            onClick: () => navigate('/identifier/' + getIssuerDID(credential)),
          },
          {
            key: 'subject',
            label: 'Subject',
            icon: <InfoCircleOutlined />,
            onClick: () =>
              navigate(
                '/identifier/' +
                  encodeURIComponent(credential.credentialSubject.id as string),
              ),
          },
          {
            key: 'download',
            label: 'Download',
            icon: <DownloadOutlined />,
            onClick: handleDownload,
          },
          {
            key: 'copy',
            label: 'Copy to',
            type: 'group',
            children: agentsToCopyTo.map((_agent: any, index: number) => {
              return {
                key: index,
                onClick: () => handleCopyTo(_agent.context?.id),
                label: _agent.context?.name,
              }
            }),
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  )
}
export default CredentialActionsDropdown
