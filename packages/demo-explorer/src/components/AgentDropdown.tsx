import { Dropdown } from 'antd'
import React, { useEffect, useState } from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { useNavigate } from 'react-router-dom'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'

const AgentDropdown: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agents, setActiveAgentId, activeAgentId, addAgentConfig } =
    useVeramo()
  const navigate = useNavigate()

  const schemaUrl = process.env.REACT_APP_SCHEMA_URL
  const apiKey = process.env.REACT_APP_REMOTE_AGENT_API_KEY
  const defaultAgentId = process.env.REACT_APP_DEFAULT_AGENT_ID || ''
  const [agentUrl, setAgentUrl] = useState<string>('')

  const { data: schema } = useQuery(
    ['schema', { endpoint: schemaUrl }],
    async () => {
      if (schemaUrl) {
        const response = await fetch(schemaUrl)
        return await response.json()
      }
    },
    {
      enabled: !!schemaUrl,
    },
  )

  useEffect(() => {
    if (schema) {
      setAgentUrl(schema.servers[0].url)
    }
  }, [schema])

  useEffect(() => {
    if (agents) {
      const existingAgent = agents.find(
        (_agent: any) => _agent.context?.id === defaultAgentId,
      )
      if (!existingAgent) {
        if (schema && agentUrl && apiKey && schemaUrl) {
          addAgentConfig({
            context: { id: defaultAgentId, name: 'Agent', schema: schemaUrl },
            remoteAgents: [
              {
                url: agentUrl,
                enabledMethods: Object.keys(schema['x-methods']),
                token: apiKey,
              },
            ],
          })
          setActiveAgentId('agentApi')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents, schema, agentUrl, apiKey, schemaUrl])

  return (
    <Dropdown
      menu={{
        items: [
          ...agents.map((_agent: any, index: number) => {
            return {
              key: index,
              onClick: () => setActiveAgentId(_agent.context?.id),
              icon: (
                <CheckCircleOutlined
                  style={{
                    fontSize: '17px',
                    opacity: _agent.context?.id === activeAgentId ? 1 : 0.1,
                  }}
                  rev={undefined}
                />
              ),
              label: _agent.context?.name,
            }
          }),
          ...[
            { type: 'divider' as const },
            {
              key: 'manage',
              label: 'Magage',
              onClick: () => navigate('/agents'),
            },
            {
              key: 'connect',
              label: 'Connect',
              onClick: () => navigate('/connect'),
            },
          ],
        ],
      }}
    >
      {children}
    </Dropdown>
  )
}
export default AgentDropdown
