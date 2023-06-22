import React, { useState } from 'react'
import { Card, Button, Input, Form } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { PushpinOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { PageContainer } from '@ant-design/pro-components'

const Agents = () => {
  const {
    activeAgentId,
    setActiveAgentId,
    getAgent,
    updateAgentConfig,
    getAgentConfig,
  } = useVeramo()
  const { id } = useParams<{ id: string }>()
  if (!id) throw Error('Agent id is missing')

  const agent = getAgent(id)
  const config = getAgentConfig(id)
  const [agentName, setAgentName] = useState<string>(agent?.context.name || '')

  const updateAgentName = (name: string) => {
    updateAgentConfig(agent.context.id as string, {
      ...config,
      context: { ...config.context, name },
    })

    setAgentName('')
  }

  return (
    <PageContainer title={agent.context.name}>
      <Card
        title="Agent info"
        actions={[
          <Button
          // @ts-ignore FIXME: why is ts complaining about this?
            icon={<PushpinOutlined />}
            disabled={activeAgentId === agent.context.id}
            onClick={() =>
              agent.context.id && setActiveAgentId(agent.context.id)
            }
          >
            Make Default
          </Button>,
        ]}
      >
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 30 }} layout="inline">
          <Form.Item label="Agent name">
            <Input
              type="text"
              onChange={(e) => setAgentName(e.target.value)}
              value={agentName}
            />
          </Form.Item>
          <Button onClick={() => updateAgentName(agentName)}>Update</Button>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default Agents
