import React, { useEffect, useState } from 'react'
import { Typography, Form, Input, Button, List } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@ant-design/pro-components'

const Connect = () => {
  const navigate = useNavigate()
  const { addAgentConfig } = useVeramo()
  const [name, setName] = useState<string>()
  const [schemaUrl, setSchemaUrl] = useState<string>()
  const [agentUrl, setAgentUrl] = useState<string>('')
  const [apiKey, setApiKey] = useState<string>()

  const newAgentConfig = () => {
    addAgentConfig({
      context: { name, schema: schemaUrl },
      remoteAgents: [
        {
          url: agentUrl,
          enabledMethods: Object.keys(schema['x-methods']),
          token: apiKey,
        },
      ],
    })
    navigate('/agents')
  }

  const {
    data: schema,
    isLoading: schemaLoading,
    isError: schemaError,
  } = useQuery(
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

  const methods = () => {
    return (
      schema &&
      schema['x-methods'] && (
        <div className={'option-list'}>
          <List
            header={
              <Typography.Title level={5}>Available methods</Typography.Title>
            }
            dataSource={Object.keys(schema['x-methods'])}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>{item}</Typography.Text>
              </List.Item>
            )}
          />
        </div>
      )
    )
  }

  useEffect(() => {
    if (schema) {
      setAgentUrl(schema.servers[0].url)
      setName(schema.info.title)
    }
  }, [schema])

  return (
    <PageContainer title="Connect">
      <Form layout={'vertical'}>
        <Form.Item
          hasFeedback
          validateStatus={
            !schemaUrl
              ? ''
              : schemaLoading
              ? 'validating'
              : schemaError
              ? 'error'
              : 'success'
          }
          label="Agent Schema URL"
        >
          <Input
            id="validating"
            size="large"
            placeholder="Agent schema"
            value={schemaUrl}
            onChange={(e) => setSchemaUrl(e.target.value)}
          />
        </Form.Item>
        {methods()}
        {schema && (
          <>
            <Form.Item label="Agent name">
              <Input
                size="large"
                placeholder="Remote Agent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Agent Url">
              <Input
                size="large"
                placeholder="Agent Url"
                defaultValue={schema.servers[0].url}
                value={agentUrl}
                onChange={(e) => setAgentUrl(e.target.value)}
              />
            </Form.Item>
            {/* <Form.Item label="Agent Url">
              <Select>
                {schema && schema.servers.map((server: {url: string}) => {
                    <Select.Option key={server.url} value={server.url}>{server.url}</Select.Option>
                })}
              </Select>
            </Form.Item> */}
            <Form.Item label="API Key">
              <Input
                size="large"
                placeholder="API Key"
                value={apiKey}
                type="password"
                onChange={(e) => setApiKey(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                block
                shape="round"
                disabled={!name || !schemaUrl || !apiKey || !agentUrl}
                onClick={() => newAgentConfig()}
              >
                Submit
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
      {/* <Card title="Deploy agent">Deploy an agent to heroku</Card> */}
    </PageContainer>
  )
}

export default Connect
