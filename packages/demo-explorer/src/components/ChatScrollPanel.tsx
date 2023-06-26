import React from 'react'
import { Col } from 'antd'

interface ChatScrollPanelProps {
  children: React.ReactNode
  reverse?: boolean
  id?: string
}

const ChatScrollPanel: React.FC<ChatScrollPanelProps> = ({
  children,
  reverse,
  id,
}) => {
  const reverseStyles = reverse
    ? {
        flexDirection: 'row-reverse',
      }
    : {
        flexDirection: 'column',
      }

  return (
    <Col
      id={id}
      className={'hide-scroll'}
      // @ts-ignore
      style={{
        ...(reverse ? reverseStyles : {}),
        flex: 1,
        overflow: 'scroll',
      }}
    >
      <div id="scroll-items">{children}</div>
    </Col>
  )
}

export default ChatScrollPanel
