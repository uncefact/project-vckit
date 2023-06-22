import React from 'react'
import { Row, Typography, Avatar, Col, theme } from 'antd'
import { shortId } from '../utils/did'
import { IMessage } from '@veramo/core'
import { useChat } from '../context/ChatProvider'
import { IIdentifierProfile } from '../context/plugins/IdentifierProfile'
const { useToken } = theme
const { Text } = Typography

interface ChatThreadProfileHeaderProps {
  did: string
  profile?: IIdentifierProfile
  onRowClick?: any
  selected?: boolean
  lastMessage?: IMessage
}

const ChatThreadProfileHeader: React.FC<ChatThreadProfileHeaderProps> = ({
  did,
  profile,
  onRowClick,
  selected,
  lastMessage,
}) => {
  const { token } = useToken()
  const { selectedDid } = useChat()

  return (
    <Row
      onClick={onRowClick}
      style={{
        cursor: 'pointer',
        padding: 20,
        backgroundColor: selected ? token.colorPrimaryBg : 'transparent',
        alignItems: 'center',
        borderRadius: token.borderRadius,
      }}
    >
      <Col>
        <Avatar src={profile?.picture} size={50} style={{ marginRight: 15 }} />
      </Col>
      <Col style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {profile ? (
          <Col>
            <Row>
              <Text style={{ marginBottom: 0 }} strong>
                {profile.name}
              </Text>
            </Row>
          </Col>
        ) : (
          <div>
            <Text style={{ marginBottom: 0 }} strong>
              {shortId(did)}
            </Text>
          </div>
        )}
        {lastMessage && lastMessage.type === 'veramo.io-chat-v1' && (
          <Text style={{ color: token.colorTextSecondary }}>
            {lastMessage.from === selectedDid && 'You: '}
            {(lastMessage.data as any).message}
          </Text>
        )}
      </Col>
    </Row>
  )
}

export default ChatThreadProfileHeader
