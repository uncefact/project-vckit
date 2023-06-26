import React from 'react'
import { Row, theme } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import ChatThreadProfileHeader from './ChatThreadProfileHeader'
const { useToken } = theme

interface ChatThreadHeaderProps {
  counterParty: CounterParty
  threadId?: string
}

interface CounterParty {
  did: string
}

const ChatThreadHeader: React.FC<ChatThreadHeaderProps> = ({
  counterParty,
  threadId,
}) => {
  const { token } = useToken()
  const { agent } = useVeramo()

  const { data: profile } = useQuery(
    ['profile', counterParty.did, agent?.context.id],
    () =>
      counterParty.did
        ? agent?.getIdentifierProfile({ did: counterParty.did })
        : undefined,
  )

  if (!counterParty || !counterParty.did) {
    return (
      <Row
        style={{
          cursor: 'pointer',
          padding: 20,
          backgroundColor: token.colorBgTextHover,
          alignItems: 'center',
        }}
      >
        Loading
      </Row>
    )
  }
  return (
    <div>
      <ChatThreadProfileHeader did={counterParty?.did} profile={profile} />
    </div>
  )
}

export default ChatThreadHeader
