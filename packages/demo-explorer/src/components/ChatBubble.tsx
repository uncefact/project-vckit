import React from 'react'
import { Row, theme } from 'antd'
const { useToken } = theme

interface ChatBubbleProps {
  text: string
  isSender?: boolean
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isSender }) => {
  const { token } = useToken()
  return (
    <Row
      style={{
        justifyContent: isSender ? 'flex-end' : 'flex-start',
        paddingRight: 15,
        paddingLeft: 15,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          background: isSender
            ? token.colorPrimaryBorderHover
            : token.colorBgContainer,
          padding: '10px 20px',
          borderRadius: 20,
          boxShadow: '1px 1px 1px rgba(0,0,0,0.1)',
          color: token.colorText,
        }}
      >
        {text}
      </div>
    </Row>
  )
}

export default ChatBubble
