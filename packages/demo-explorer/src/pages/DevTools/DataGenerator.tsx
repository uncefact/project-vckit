import React, { useEffect } from 'react'
import {
  Typography,
  Button,
  Row,
  Input,
  Form,
  Select,
  Divider,
  Collapse,
  Space,
} from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery, useQueryClient } from 'react-query'
import * as generatorUtils from '../../utils/dataGenerator'
import { useGenerator } from '../../hooks/useGenerator'
import { PageContainer } from '@ant-design/pro-components'

const { Title, Text } = Typography
const { Panel } = Collapse

const DataGenerator: React.FC = () => {
  const queryClient = useQueryClient()
  const { agent } = useVeramo()
  const { data: identifiers } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.dataStoreORMGetIdentifiers(),
  )
  const { data: providers } = useQuery(
    ['providers', { agentId: agent?.context.id }],
    () => agent?.didManagerGetProviders(),
  )

  const {
    domain,
    identifierProvider,
    identifierCount,
    identifiersGenerating,
    credentialProfilesGenerating,
    credentialIssueFromCount,
    credentialIssueToCount,
    credentialsP2PGenerating,
    setDomain,
    setCredentialsP2PGenerating,
    setCredentialIssueToCount,
    setCredentialIssueFromCount,
    setCredentialProfilesGenerating,
    setIdentifierProvider,
    setIdentifierCount,
    setIdentifiersGenerating,
  } = useGenerator()

  const generateIdentifiers = async () => {
    setIdentifiersGenerating(true)

    await generatorUtils.createIdentifiers(
      agent?.didManagerCreate,
      domain,
      identifierProvider,
      identifierCount,
    )
    setIdentifiersGenerating(false)
    queryClient.invalidateQueries('identifiers')
  }

  const generateProfileCredentials = async () => {
    if (identifiers) {
      setCredentialProfilesGenerating(true)

      await generatorUtils.createProfileCredentials(
        // @ts-ignore
        agent?.createVerifiableCredential,
        // @ts-ignore
        identifiers,
      )

      setCredentialProfilesGenerating(false)
    }
  }

  const generateP2PCredentials = async () => {
    if (identifiers) {
      setCredentialsP2PGenerating(true)

      // Some form validation needed
      const fromCount =
        credentialIssueFromCount > identifiers.length
          ? identifiers.length
          : credentialIssueFromCount

      const toCount =
        credentialIssueToCount > identifiers.length
          ? identifiers.length
          : credentialIssueToCount

      await generatorUtils.createP2PCredentials(
        // @ts-ignore
        identifiers,
        // @ts-ignore
        agent?.createVerifiableCredential,
        'Kudos',
        // @todo allow custom credential
        { kudos: 1 },
        { from: fromCount, to: toCount },
        // @todo allow date to be user selectable
        { from: '2019-01-01T00:00:00.271Z', to: '2021-02-01T01:00:00.271Z' },
      )

      setCredentialsP2PGenerating(false)
    }
  }

  useEffect(() => {
    setIdentifierProvider('did:ethr:goerli')
  }, [setIdentifierProvider])

  return (
    <PageContainer>
      <Collapse bordered={false}>
        <Panel header={`Identifiers (${identifiers?.length})`} key="1">
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="vertical"
          >
            <Text>Generate multiple identifiers</Text>
            <Form.Item label="Identifier count">
              <Input
                defaultValue={identifierCount}
                onChange={(e) => setIdentifierCount(parseInt(e.target.value))}
              />
            </Form.Item>
            {identifierProvider === 'did:web' && (
              <Form.Item label="Domain">
                <Input
                  defaultValue={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </Form.Item>
            )}
            <Form.Item label="Provider">
              <Select
                onSelect={(value: string) => setIdentifierProvider(value)}
                defaultValue="did:ethr:goerli"
              >
                {providers?.map((provider: string) => {
                  return (
                    <Select.Option key={provider} value={provider}>
                      {provider}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                onClick={() => generateIdentifiers()}
                disabled={
                  (identifierProvider === 'did:web' && !domain) ||
                  identifiersGenerating ||
                  !identifierCount ||
                  !identifierProvider
                }
              >
                Generate
              </Button>
            </Form.Item>
            {identifiersGenerating && (
              <Text>Generating {identifierCount} identifiers..</Text>
            )}
          </Form>
        </Panel>
        <Panel header="Credentials" key="2">
          <Title level={5}>Profile Credentials</Title>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="vertical"
          >
            <Space direction="vertical">
              <Text>
                Generate self-signed random profile credentials for{' '}
                <b>{identifiers?.length}</b> identifiers. Note profiles will be
                different everytime this is run.
              </Text>
              <Row style={{ padding: '20px 0' }}>
                <pre>
                  <code>
                    {JSON.stringify(
                      {
                        name: 'string',
                        nickname: 'string',
                        email: 'string',
                        profileImage: 'string',
                      },
                      null,
                      2,
                    )}
                  </code>
                </pre>
              </Row>
              <Form.Item>
                <Button
                  onClick={() => generateProfileCredentials()}
                  disabled={credentialProfilesGenerating || !identifiers}
                >
                  Generate Credentials
                </Button>
              </Form.Item>
              {credentialProfilesGenerating && (
                <Text>Generating {identifierCount} credentials..</Text>
              )}
            </Space>
          </Form>
          <Divider></Divider>
          <Title level={5}>Peer to Peer Credentials</Title>
          <Form>
            <Space direction="vertical">
              <Text>Issue Kudos credential schema between identifiers</Text>
              <Row style={{ padding: '20px 0' }}>
                <pre>
                  <code>
                    {JSON.stringify(
                      {
                        kudos: 1,
                      },
                      null,
                      2,
                    )}
                  </code>
                </pre>
              </Row>

              <Form.Item>
                <Text>
                  Issue Kudos credential schema between identifiers. Using
                  higher numbers of identifiers will take longer. Run multiple
                  times with lower numbers for varying results. Number should
                  not be more that the amount of identifiers in your agent.
                  Putting 2 and 5 in the boxes below will issue 1 credential
                  from 2 random identifiers to 5 random identifers.
                </Text>
              </Form.Item>

              <Form.Item label="Issuer count">
                <Input
                  width={200}
                  defaultValue={credentialIssueFromCount}
                  onChange={(e) =>
                    setCredentialIssueFromCount(parseInt(e.target.value))
                  }
                />
              </Form.Item>
              <Form.Item label="Subject count">
                <Input
                  width={200}
                  defaultValue={credentialIssueToCount}
                  onChange={(e) =>
                    setCredentialIssueToCount(parseInt(e.target.value))
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  disabled={credentialsP2PGenerating || !identifiers}
                  onClick={() => generateP2PCredentials()}
                >
                  Generate Credentials
                </Button>
              </Form.Item>
              {credentialsP2PGenerating && (
                <Text>
                  Issuing credentials from <b>{credentialIssueFromCount}</b>{' '}
                  identifiers to <b>{credentialIssueToCount}</b> identifers
                </Text>
              )}
            </Space>
          </Form>
        </Panel>
        {/* <Panel header="Requests" key="3">
          <Text>Generate requests between identifiers</Text>
        </Panel>
        <Panel header="Presentations" key="4">
          <Text>Generate presentations between identifiers</Text>
        </Panel> */}
      </Collapse>
    </PageContainer>
  )
}

export default DataGenerator
