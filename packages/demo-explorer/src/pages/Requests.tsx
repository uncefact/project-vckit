import React from 'react'
import { Tag, List, Card, Avatar } from 'antd'
import { formatDistanceToNow, format } from 'date-fns'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import md5 from 'md5'
import { useNavigate } from 'react-router-dom'
import CreateRequest from '../components/CreateRequest'
import { IMessage } from '@vckit/core'
import { PageContainer } from '@ant-design/pro-components'

// Move
const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'
const uri = (did: string) => {
  return GRAVATAR_URI + md5(did) + '?s=200&d=retro'
}

const Requests = () => {
  const navigate = useNavigate()
  const { agent } = useVeramo()
  const { data: messages } = useQuery(
    ['requests', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetMessages({
        where: [{ column: 'type', value: ['sdr'] }],
        order: [{ column: 'createdAt', direction: 'DESC' }],
      }),
  )

  return (
    <PageContainer>
      <CreateRequest />

      <List
        dataSource={messages}
        renderItem={(item: IMessage, index: number) => (
          <Card
            key={index}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/requests/sdr/' + item.id)}
          >
            <Card.Meta
              avatar={<Avatar size="large" src={uri(item.from || '')} />}
              title={item.from}
              description={
                'Request to share data ' +
                formatDistanceToNow(new Date(item.createdAt as string)) +
                ' ago'
              }
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

export default Requests
