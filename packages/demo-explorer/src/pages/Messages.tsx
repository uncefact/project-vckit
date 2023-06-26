import React from 'react'
import { Tag, List, Card, Avatar } from 'antd'
import { format } from 'date-fns'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import md5 from 'md5'
import { IMessage } from '@veramo/core'
import { PageContainer } from '@ant-design/pro-components'
import { shortId } from '../utils/did'

const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

const messageType = (type: string) => {
  switch (type) {
    case 'w3c.vc':
      return 'verifiable credential'
    case 'w3c.vp':
      return 'verifiable presentation'
    case 'sdr':
      return 'SDR'
    default:
      return type
  }
}

const Messages = () => {
  const { agent } = useVeramo()
  const uri = (did: string) => {
    return GRAVATAR_URI + md5(did) + '?s=200&d=retro'
  }
  const { data: messages } = useQuery(
    ['messages', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetMessages({
        order: [{ column: 'createdAt', direction: 'DESC' }],
      }),
  )

  return (
    <PageContainer>
      <List
        dataSource={messages}
        renderItem={(item: IMessage, index: number) => (
          <Card key={index} style={{ marginBottom: 10 }}>
            <Card.Meta
              avatar={<Avatar size="large" src={uri(item.from || '')} />}
              title={shortId(item.from as string)}
              description={`To: ${shortId(item.to as string)} - ${messageType(
                item.type,
              )}`}
            ></Card.Meta>
            {item?.credentials &&
              item?.credentials.map((vc) => {
                return (
                  <Card style={{ marginTop: 20 }} title="Verifiable Credential">
                    <Card.Meta
                      style={{ marginBottom: 15 }}
                      title="Issuer"
                      description={<>vc.issuer</>}
                      avatar={
                        <Avatar
                          size="large"
                          src={uri((vc.issuer as string) || '')}
                        />
                      }
                    ></Card.Meta>
                    <div style={{ marginLeft: 55 }}>
                      <Card.Meta
                        style={{ marginBottom: 15 }}
                        title="Subject"
                        description={
                          <code>
                            <pre>
                              {JSON.stringify(vc.credentialSubject, null, 2)}
                            </pre>
                          </code>
                        }
                      ></Card.Meta>
                      <Card.Meta
                        style={{ marginBottom: 15 }}
                        title="Issuance Date"
                        description={format(
                          new Date(vc.issuanceDate),
                          'do MMM yyyy',
                        )}
                      ></Card.Meta>
                      <Card.Meta
                        style={{ marginBottom: 15 }}
                        title="Credential Type"
                        description={(vc.type as string[]).map((type) => (
                          <Tag color="geekblue">{type}</Tag>
                        ))}
                      ></Card.Meta>
                      <Card.Meta
                        style={{ marginBottom: 15 }}
                        title="Proof Type"
                        description={<Tag color="green">{vc.proof.type}</Tag>}
                      ></Card.Meta>
                    </div>
                  </Card>
                )
              })}
          </Card>
        )}
      ></List>
    </PageContainer>
  )
}

export default Messages
