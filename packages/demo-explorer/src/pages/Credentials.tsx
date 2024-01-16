import React from 'react'

import { format, formatRelative } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Flex } from 'antd'

import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo-community/react-components'
import {
  IDIDManager,
  IDataStoreORM,
  IIdentifier,
  TCredentialColumns,
  UniqueVerifiableCredential,
  Where,
} from '@veramo/core'
import { EllipsisOutlined } from '@ant-design/icons'

import { getIssuerDID } from '../utils/did'
import { RangeValue } from '../types'

import IdentifierProfile from '../components/IdentifierProfile'
import CredentialActionsDropdown from '../components/CredentialActionsDropdown'
import DateRangePicker from '../components/DateRangePicker'
import IdentifierSelected from '../components/IdentifierSelected'

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE = 1

function generateGetVerifiableCredentialsWhereQuery(
  selectedIssuer?: string[],
  issuanceDate?: RangeValue,
): Where<TCredentialColumns>[] {
  const where: Where<TCredentialColumns>[] = []
  if (selectedIssuer) {
    where.push({
      column: 'issuer',
      value: [...selectedIssuer],
    })
  }

  if (issuanceDate) {
    where.push({
      column: 'issuanceDate',
      op: 'Between',
      value: [
        format(issuanceDate?.[0] as Date, 'yyyy-MM-dd '),
        format(issuanceDate?.[1] as Date, 'yyyy-MM-dd'),
      ],
    })
  }

  return where
}

const Credentials = () => {
  const navigate = useNavigate()
  const { agent } = useVeramo<IDataStoreORM | IDIDManager>()
  const [page, setPage] = React.useState(DEFAULT_PAGE)
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE)
  const [filter, setFilter] = React.useState<RangeValue>(null)
  const [identifierSelected, setIdentifierSelected] = React.useState<string[]>([])

  const { data: identifiers } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const isValidIssuers = identifierSelected?.length > 0
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

        where: generateGetVerifiableCredentialsWhereQuery(
          identifierSelected,
          filter,
        ),
      }),
    { enabled: isValidIssuers },
  )

  const { data: credentialsCount, refetch: refetchCount } = useQuery(
    ['credentialsCount', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsCount({
        where: generateGetVerifiableCredentialsWhereQuery(
          identifierSelected,
          filter,
        ),
      }),
    { enabled: isValidIssuers },
  )

  const resetPagination = () => {
    setPage(DEFAULT_PAGE)
    setPageSize(DEFAULT_PAGE_SIZE)
  }

  const getFilterValue = (date: RangeValue) => {
    setFilter(date)
    resetPagination()
  }

  const getIdentifierSelected = (issuer: string[]) => {
    resetPagination()
    if (issuer.length === 0) {
      setIdentifierSelected(
        (identifiers as IIdentifier[]).map((identifier) => identifier.did),
      )
      return
    }

    setIdentifierSelected(issuer)
  }

  React.useEffect(() => {
    refetch()
    refetchCount()
  }, [page, pageSize, filter, identifierSelected])

  React.useEffect(() => {
    if (identifiers?.length > 0) {
      setIdentifierSelected(
        (identifiers as IIdentifier[]).map((identifier) => identifier.did),
      )
    }
  }, [identifiers])

  return (
    <PageContainer>
      <Flex wrap="wrap" justify="flex-start" align="start" vertical={false}>
        <DateRangePicker
          dateFormat="dd/MM/yyyy HH:mm:ss"
          getFilterValue={getFilterValue}
        />
        <IdentifierSelected
          identifiers={identifiers}
          getIdentifierSelected={getIdentifierSelected}
        />
      </Flex>
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
