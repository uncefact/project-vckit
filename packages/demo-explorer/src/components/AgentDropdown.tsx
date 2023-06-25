import { Dropdown } from 'antd'
import React from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { useNavigate } from 'react-router-dom'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useAuth0 } from "@auth0/auth0-react";

const AgentDropdown: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agents, setActiveAgentId, activeAgentId } = useVeramo()
  const navigate = useNavigate()
  const { logout } = useAuth0();  
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
                  }} rev={undefined}                />
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
            {
              key: 'logout',
              label: 'Logout',
              onClick: () => logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              }) ,
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
