import React from 'react'
import { parse, formatRelative, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo-community/react-components'
import { IDataStoreORM, UniqueVerifiableCredential } from '@veramo/core'
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
  const { agent } = useVeramo<IDataStoreORM>()
  const [page, setPage] = React.useState(DEFAULT_PAGE)
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE)
  const [filter, setFilter] = React.useState<string[] | RangeValue>([
    convertDateToFormat(dateFormat),
    convertDateToFormat(dateFormat),
  ])

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
        ],
      }),
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
        ],
      }),
  )

  const getFilterValue = (date: RangeValue) => {
    setFilter(date)
  }

  React.useEffect(() => {
    refetch()
    refetchCount()
  }, [page, pageSize, filter])

  React.useEffect(() => {
    setPage(DEFAULT_PAGE)
    setPageSize(DEFAULT_PAGE_SIZE)
  }, [filter])

  return (
    <PageContainer>
      <FilterRangePicker getFilterValue={getFilterValue} />
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
