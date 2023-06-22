import React from 'react'
import { Col, Row, Statistic } from 'antd'

import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM } from '@vckit/core'
import { useQuery } from 'react-query'
import { PageContainer } from '@ant-design/pro-components'

const Statistics: React.FC = () => {
  const { agent } = useVeramo<IDataStoreORM>()

  const { data: credentialsCount, isLoading: loading1 } = useQuery(
    ['credentialsCount', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetVerifiableCredentialsCount(),
  )

  const { data: identifiersCount, isLoading: loading2 } = useQuery(
    ['identifiersCount', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetIdentifiersCount(),
  )

  return (
    <PageContainer title={'Statistics'} loading={loading1 || loading2}>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Issued Credentials"
            value={credentialsCount}
            loading={loading1}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Known Identifiers"
            value={identifiersCount}
            loading={loading2}
          />
        </Col>
      </Row>
    </PageContainer>
  )
}

export default Statistics
