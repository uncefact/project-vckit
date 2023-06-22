import React from 'react'
import { Row, Avatar, Col, Typography, theme, Skeleton } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifierProfilePlugin } from '../context/plugins/IdentifierProfile'
import { shortId } from '../utils/did'

interface IdentifierProfileProps {
  did: string
  showShortId?: boolean
}

const IdentifierProfile: React.FC<IdentifierProfileProps> = ({
  did,
  showShortId = true,
}) => {
  const { agent } = useVeramo<IIdentifierProfilePlugin>()
  const { token } = theme.useToken()

  const { data, isLoading } = useQuery(
    ['identifierProfile', did, agent?.context.id],
    () => (did ? agent?.getIdentifierProfile({ did }) : undefined),
  )

  return (
    <Row align="middle" wrap={false}>
      <Col style={{ marginRight: token.padding }}>
        {!isLoading && <Avatar src={data?.picture} />}
        {isLoading && <Skeleton.Avatar active />}
      </Col>
      <Col>
        <div style={{ justifyItems: 'flex-start', display: 'flex' }}>
          {!isLoading && (
            <Typography.Text ellipsis>{data?.name}</Typography.Text>
          )}
          {isLoading && <Skeleton.Input style={{ width: 100 }} active />}
        </div>
        {showShortId && data?.name && data?.name !== shortId(did) && (
          <div>
            <Typography.Text
              ellipsis
              style={{ color: token.colorTextSecondary }}
            >
              {shortId(did)}
            </Typography.Text>
          </div>
        )}
      </Col>
    </Row>
  )
}

export default IdentifierProfile
