import React from 'react'
import { Table, Input, Button, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer } from '@ant-design/pro-components'
import { IIdentifier } from '@veramo/core'
import { CopyOutlined } from '@ant-design/icons'
import IdentifierProfile from '../components/IdentifierProfile'

const { Search } = Input

const KnownIdentifiers = () => {
  const { agent } = useVeramo()
  const navigate = useNavigate()

  const { data: identifiers, isLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.dataStoreORMGetIdentifiers(),
  )

  const columns = [
    {
      title: 'Identifier',
      dataIndex: 'did',
      key: 'did',
      render: (did: string) => (
        <Link to={'/identifier/' + encodeURIComponent(did)}>
          <IdentifierProfile did={did} />
        </Link>
      ),
    },
    {
      title: 'Actions',
      key: 'did',
      render: (did: IIdentifier) => (
        <Button
          key={'copy'}
          type="text"
          // @ts-ignore FIXME: why is ts complaining about this?
          icon={<CopyOutlined />}
          title="Copy DID to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(did.did)
            notification.success({
              message: 'Copied identifier to clipboard',
            })
          }}
        />
      ),
    },
  ]

  return (
    <PageContainer>
      <Search
        placeholder="Resolve DID"
        onSearch={(value) => navigate('/identifier/' + value)}
        style={{ width: 400, marginBottom: 20 }}
      />
      <Table
        loading={isLoading}
        rowKey={(record) => record.did as string}
        dataSource={identifiers}
        // @ts-ignore
        columns={columns}
      />
    </PageContainer>
  )
}

export default KnownIdentifiers
