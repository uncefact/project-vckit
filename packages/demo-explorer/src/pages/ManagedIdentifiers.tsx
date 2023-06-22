import React, { useState } from 'react'
import { Table, Button, Row, Space, notification } from 'antd'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer } from '@ant-design/pro-components'
import { IDIDManager } from '@veramo/core-types'
import NewIdentifierModalForm, {
  NewIdentifierModalValues,
} from '../components/NewIdentifierModalForm'
import { shortId } from '../utils/did'
import { createMediateRequestMessage } from '../utils/didcomm-mediation'
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import { IIdentifier } from '@veramo/core'
import IdentifierProfile from '../components/IdentifierProfile'

const ManagedIdentifiers = () => {
  const { agent } = useVeramo<IDIDManager>()
  const [isNewIdentifierModalVisible, setIsNewIdentifierModalVisible] =
    useState(false)

  const { data: providers } = useQuery(
    ['providers', { agentId: agent?.context.id }],
    () => agent?.didManagerGetProviders(),
  )
  const {
    data: identifiers,
    isLoading,
    refetch,
  } = useQuery(['identifiers', { agentId: agent?.context.id }], () =>
    agent?.didManagerFind(),
  )

  const columns = [
    {
      title: 'DID',
      dataIndex: 'did',
      key: 'did',
      render: (did: string) => (
        <Link to={'/identifier/' + encodeURIComponent(did)}>
          <IdentifierProfile did={did} />
        </Link>
      ),
    },
    {
      title: 'Alias',
      dataIndex: 'alias',
      key: 'alias',
      responsive: ['md'],
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      responsive: ['md'],
    },
    {
      title: 'Actions',
      key: 'did',
      render: (did: IIdentifier) => (
        <Space>
          <Button
            key={'copy'}
            type="text"
            icon={<CopyOutlined />}
            title="Copy DID to clipboard"
            onClick={() => {
              navigator.clipboard.writeText(did.did)
              notification.success({
                message: 'Copied identifier to clipboard',
              })
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            type="text"
            onClick={() => {
              if (window.confirm(`Delete ${shortId(did.did)}`)) {
                agent?.didManagerDelete({ did: did.did })
                refetch()
                notification.success({
                  message: 'Identifier deleted',
                })
              }
            }}
          ></Button>
        </Space>
      ),
    },
  ]

  const showNewIdentifierModal = () => {
    setIsNewIdentifierModalVisible(true)
  }
  const handleNewIdentifierOk = async (values: NewIdentifierModalValues) => {
    const { alias, provider } = values
    let options = undefined
    if (provider === 'did:peer') {
      options = {
        num_algo: 2,
        service: {
          id: '1234',
          type: 'DIDCommMessaging',
          serviceEndpoint: 'did:web:dev-didcomm-mediator.herokuapp.com',
          description: 'a DIDComm endpoint',
        },
      }
    }
    const identifier = await agent?.didManagerCreate({
      alias,
      provider,
      options,
    })
    if (!identifier) return

    if (provider === 'did:peer') {
      const message = createMediateRequestMessage(
        identifier.did,
        'did:web:dev-didcomm-mediator.herokuapp.com',
      )

      const stored = await agent?.dataStoreSaveMessage({ message })
      console.log('stored?: ', stored)

      const packedMessage = await agent?.packDIDCommMessage({
        packing: 'authcrypt',
        message,
      })

      // requests mediation, and then message handler adds service to DID
      const result = await agent?.sendDIDCommMessage({
        packedMessage,
        messageId: message.id,
        recipientDidUrl: 'did:web:dev-didcomm-mediator.herokuapp.com',
      })
      console.log('result: ', result)
    }

    setIsNewIdentifierModalVisible(false)
    refetch()
  }
  const handleNewIdentifierCancel = () => {
    setIsNewIdentifierModalVisible(false)
  }

  return (
    <PageContainer>
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Row style={{ justifyContent: 'flex-end' }}>
          <Button onClick={() => showNewIdentifierModal()}>
            Create New Identifier
          </Button>
        </Row>
        <Table
          loading={isLoading}
          rowKey={(record) => record.did as string}
          dataSource={identifiers}
          // @ts-ignore
          columns={columns}
        />

        {agent?.availableMethods().includes('didManagerCreate') && providers && (
          <NewIdentifierModalForm
            visible={isNewIdentifierModalVisible}
            onNewIdentifier={handleNewIdentifierOk}
            onCancel={() => {
              handleNewIdentifierCancel()
            }}
            providers={providers}
          />
        )}
      </Space>
    </PageContainer>
  )
}

export default ManagedIdentifiers
