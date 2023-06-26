import React from 'react'
import { Modal, QRCode, Row } from 'antd'
import { v4 } from 'uuid'
import { encodeBase64url } from '@veramo/utils'

interface ChatInviteQRCodeModalProps {
  visible: boolean
  did: string
  onOk: () => void
  onCancel: () => void
}

const ChatInviteQRCodeModal: React.FC<ChatInviteQRCodeModalProps> = ({
  visible,
  did,
  onOk,
  onCancel,
}) => {
  const message = {
    type: 'https://didcomm.org/out-of-band/2.0/invitation',
    id: v4(),
    from: did,
  }

  const { protocol, hostname, port } = window.location
  const url = `${protocol}://${hostname}:${port}/?_oob=${encodeBase64url(
    JSON.stringify(message),
  )}`

  return (
    <Modal
      open={visible}
      title="Chat invite"
      okText="Close"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={onOk}
    >
      <Row justify={'center'}>
        <QRCode value={url} size={320} />
      </Row>
    </Modal>
  )
}

export default ChatInviteQRCodeModal
