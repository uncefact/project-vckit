import React from 'react'

import { parse, formatRelative, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Flex, Select, SelectProps, Space } from 'antd'

import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo-community/react-components'
import {
  IDIDManager,
  IDataStoreORM,
  IIdentifier,
  UniqueVerifiableCredential,
} from '@veramo/core'
import { EllipsisOutlined } from '@ant-design/icons'

import { convertDateToFormat } from '../utils/dataGenerator'
import { getIssuerDID } from '../utils/did'
import IdentifierProfile from '../components/IdentifierProfile'
import CredentialActionsDropdown from '../components/CredentialActionsDropdown'
import CustomDatePickerWithDateFns from '../components/DatePicker'
import { RangeValue } from '../types'

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE = 1

const Credentials = () => {
  const dateFormat = 'yyyy/MM/dd HH:mm:ss'
  const navigate = useNavigate()
  const { agent } = useVeramo<IDataStoreORM | IDIDManager>()
  const [page, setPage] = React.useState(DEFAULT_PAGE)
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE)
  const [filter, setFilter] = React.useState<string[] | RangeValue>([
    convertDateToFormat(dateFormat),
    convertDateToFormat(dateFormat),
  ])
  const [selectedIssuer, setSelectedIssuer] = React.useState<string[]>([])

  const { data: identifiers } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const isValidIssuers = selectedIssuer?.length > 0
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

        where: [
          {
            column: 'issuanceDate',
            op: 'Between',
            value: [
              format(filter?.[0] as Date, 'yyyy-MM-dd '),
              format(filter?.[1] as Date, 'yyyy-MM-dd'),
            ],
          },
          {
            column: 'issuer',
            value: [...selectedIssuer],
          },
        ],
      }),
    { enabled: isValidIssuers },
  )

  const { data: credentialsCount, refetch: refetchCount } = useQuery(
    ['credentialsCount', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsCount({
        where: [
          {
            column: 'issuanceDate',
            op: 'Between',
            value: [
              format(filter?.[0] as Date, 'yyyy-MM-dd HH:mm:ss'),
              format(filter?.[1] as Date, 'yyyy-MM-dd HH:mm:ss'),
            ],
          },
          {
            column: 'issuer',
            value: [...selectedIssuer],
          },
        ],
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

  const getSelectedIssuer = (issuer: string[]) => {
    resetPagination()
    if (issuer.length === 0) {
      setSelectedIssuer(
        (identifiers as IIdentifier[]).map((identifier) => identifier.did),
      )
      return
    }

    setSelectedIssuer(issuer)
  }

  React.useEffect(() => {
    refetch()
    refetchCount()
  }, [page, pageSize, filter, selectedIssuer])

  React.useEffect(() => {
    if (identifiers?.length > 0) {
      setSelectedIssuer(
        (identifiers as IIdentifier[]).map((identifier) => identifier.did),
      )
    }
  }, [identifiers])

  return (
    <PageContainer>
      <Flex wrap="wrap" justify="flex-start" align="start" vertical={false}>
        <FilterRangePicker getFilterValue={getFilterValue} />
        <SelectIssuer
          identifiers={identifiers}
          getSelectedIssuer={getSelectedIssuer}
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

const FilterRangePicker = ({
  getFilterValue,
}: {
  getFilterValue: (date: RangeValue) => void
}) => {
  const { RangePicker } = CustomDatePickerWithDateFns
  const dateFormat = 'dd/MM/yyyy HH:mm:ss'

  return (
    <RangePicker
      defaultValue={[
        parse(convertDateToFormat(dateFormat), dateFormat, new Date()),
        parse(convertDateToFormat(dateFormat), dateFormat, new Date()),
      ]}
      format={dateFormat}
      showTime={{ use12Hours: true }}
      onChange={(date) => getFilterValue(date)}
    />
  )
}

const SelectIssuer = ({
  identifiers,
  getSelectedIssuer,
}: {
  identifiers: IIdentifier[]
  getSelectedIssuer: (issuer: string[]) => void
}) => {
  const options: SelectProps['options'] = []
  identifiers?.forEach((identifier) => {
    options.push({
      label: identifier.alias,
      value: identifier.did,
    })
  })

  const handleChange = (value: string[]) => {
    getSelectedIssuer(value)
  }

  return (
    <Space style={{ marginLeft: 10, width: '40%' }} direction="vertical">
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select issuer"
        onChange={handleChange}
        options={options}
      />
    </Space>
  )
}
