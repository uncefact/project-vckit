import React from 'react'
import { Button } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { formatRelative } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM, UniqueVerifiableCredential } from '@veramo/core'
import { ProList } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo-community/react-components'
import { getIssuerDID } from '../utils/did'
import IdentifierProfile from './IdentifierProfile'
import CredentialActionsDropdown from './CredentialActionsDropdown'

interface IdentifierCredentialsProps {
  identifier: string
}

const IdentifierReceivedCredentials: React.FC<IdentifierCredentialsProps> = ({
  identifier,
}) => {
  const navigate = useNavigate()
  const { agent } = useVeramo<IDataStoreORM>()
  const { data: credentials, isLoading } = useQuery(
    [
      'identifierReceivedCredentials',
      identifier,
      { agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [
          {
            column: 'subject',
            value: [identifier],
          },
        ],
      }),
  )

  return (
    <ProList
      ghost
      headerTitle="Received Credentials"
      loading={isLoading}
      pagination={{
        defaultPageSize: 4,
      }}
      grid={{ column: 1, lg: 2, xxl: 2, xl: 2 }}
      onItem={(record: any) => {
        return {
          onClick: () => {
            navigate('/credential/' + record.hash)
          },
        }
      }}
      metas={{
        title: {},
        content: {},
        actions: {
          cardActionProps: 'extra',
        },
      }}
      dataSource={credentials?.map((item: UniqueVerifiableCredential) => {
        return {
          title: (
            <IdentifierProfile did={getIssuerDID(item.verifiableCredential)} />
          ),
          actions: [
            <div>
              {formatRelative(
                new Date(item.verifiableCredential.issuanceDate),
                new Date(),
              )}
            </div>,
            <CredentialActionsDropdown credential={item.verifiableCredential}>
              <Button type="text">
                <EllipsisOutlined />
              </Button>
            </CredentialActionsDropdown>,
          ],
          content: (
            <div style={{ width: '100%' }}>
              <VerifiableCredential credential={item.verifiableCredential} />
            </div>
          ),
          hash: item.hash,
        }
      })}
    />
  )
}

export default IdentifierReceivedCredentials
