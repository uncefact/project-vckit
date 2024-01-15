import React from 'react'
import { formatRelative } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo-community/react-components'
import { IDataStoreORM, UniqueVerifiableCredential } from '@veramo/core'
import { EllipsisOutlined } from '@ant-design/icons'
import IdentifierProfile from '../components/IdentifierProfile'
import { getIssuerDID } from '../utils/did'
import CredentialActionsDropdown from '../components/CredentialActionsDropdown'

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE = 1

const Credentials = () => {
  const navigate = useNavigate()
  const { agent } = useVeramo<IDataStoreORM>()
  const [page, setPage] = React.useState(DEFAULT_PAGE)
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE)
  const {
    data: credentials,
    isLoading,
    refetch,
  } = useQuery(
    [
      'credentials',
      { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
  )

  const { data: credentialsCount } = useQuery(
    ['credentialsCount', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetVerifiableCredentialsCount(),
  )

  React.useEffect(() => {
    refetch()
  }, [page, pageSize])

  return (
    <PageContainer>
      <ProList
        ghost
        loading={isLoading}
        pagination={{
          defaultPageSize: DEFAULT_PAGE_SIZE,
          showSizeChanger: true,
          current: page,
          total: credentialsCount,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          },
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
              <IdentifierProfile
                did={getIssuerDID(item.verifiableCredential)}
              />
            ),
            actions: [
              <div>
                {formatRelative(
                  new Date(item.verifiableCredential.issuanceDate),
                  new Date(),
                )}
              </div>,
              <CredentialActionsDropdown credential={item.verifiableCredential}>
                {/* @ts-ignore FIXME: why is ts complaining about this? */}
                <EllipsisOutlined />
              </CredentialActionsDropdown>,
            ],
            content: (
              <div
                style={{ width: '100%', maxHeight: '300px', overflowY: 'auto' }}
              >
                <VerifiableCredential credential={item.verifiableCredential} />
              </div>
            ),
            hash: item.hash,
          }
        })}
      />
    </PageContainer>
  )
}

export default Credentials
