import React from 'react'
import {
  Button,
  Card,
  Layout,
  Space,
  Tabs,
  Input,
  notification,
  QRCode,
} from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IResolver } from '@vckit/core'
import IdentifierKeys from '../components/IdentifierKeys'
import IdentifierServices from '../components/IdentifierServices'
import IdentifierQuickSetup from '../components/IdentifierQuickSetup'
import IdentifierReceivedCredentials from '../components/IdentifierReceivedCredentials'
import IdentifierIssuedCredentials from '../components/IdentifierIssuedCredentials'
import { PageContainer } from '@ant-design/pro-components'
import { shortId } from '../utils/did'
import { CopyOutlined } from '@ant-design/icons'
import { IIdentifierProfilePlugin } from '../context/plugins/IdentifierProfile'

const { TextArea } = Input
const { TabPane } = Tabs

const Identifier = () => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw Error('id is missing')

  const { agent } = useVeramo<
    IDIDManager & IResolver & IIdentifierProfilePlugin
  >()
  const { data: resolutionResult, isLoading } = useQuery(
    ['identifier', id],
    () => agent?.resolveDid({ didUrl: id }),
  )
  const { data: managedDID } = useQuery(['managedDid', id], () =>
    agent?.didManagerGet({ did: id }),
  )
  const { data: profile } = useQuery(['profile', id, agent?.context.id], () =>
    agent?.getIdentifierProfile({ did: id }),
  )

  const isManaged = !!managedDID?.provider

  const hasDIDCommSetup =
    !!managedDID?.services?.find((s) => s.type === 'DIDCommMessaging') &&
    !!managedDID?.keys?.find(
      (key) => key.type === 'X25519' || key.type === 'Ed25519',
    )

  const resolved = resolutionResult?.didResolutionMetadata.error === undefined

  const title =
    profile?.name && profile?.name !== shortId(id) ? profile.name : shortId(id)
  const subTitle =
    profile?.name && profile?.name !== shortId(id) ? shortId(id) : undefined

  return (
    <PageContainer
      title={title}
      subTitle={subTitle}
      avatar={{ src: profile?.picture }}
      extra={[
        <Button
          key={'copy'}
          icon={<CopyOutlined />}
          type="text"
          title="Copy DID to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(id)
            notification.success({
              message: 'Copied identifier to clipboard',
            })
          }}
        />,
      ]}
    >
      <Tabs>
        <TabPane tab="Credentials" key="0">
          <Space direction="vertical" style={{ width: '100%' }}>
            <IdentifierReceivedCredentials identifier={id} />
            <IdentifierIssuedCredentials identifier={id} />
          </Space>
        </TabPane>
        {resolved && (
          <TabPane tab="DID Document" key="1">
            <Layout>
              <Space direction="vertical" style={{ width: '100%' }}>
                {!hasDIDCommSetup && (
                  <IdentifierQuickSetup
                    title="DIDComm mediator setup"
                    identifier={id}
                    cacheKey={`identifier-quicksetup-${id}`}
                  />
                )}
                <IdentifierKeys
                  title="Keys"
                  identifier={id}
                  cacheKey={`identifier-keys-${id}`}
                  isManaged={isManaged}
                />
                <IdentifierServices
                  title="Services"
                  identifier={id}
                  cacheKey={`identifier-services-${id}`}
                  isManaged={isManaged}
                />
              </Space>
            </Layout>
          </TabPane>
        )}
        <TabPane tab="Resolution Result" key="2">
          <Card loading={isLoading} size="small">
            <TextArea
              autoSize
              readOnly
              style={{ width: '100%', height: '100%' }}
              value={JSON.stringify(resolutionResult, null, 2)}
            />
          </Card>
        </TabPane>
        <TabPane tab="QR Code">
          <QRCode value={id} size={320} />
        </TabPane>
      </Tabs>
    </PageContainer>
  )
}

export default Identifier
