import React, { useState } from 'react'
import { Button, Modal, List, message } from 'antd'
import { DeleteOutlined, LockOutlined } from '@ant-design/icons'
import { useVeramo } from '@veramo-community/veramo-react'
import { shortId } from '../utils/did'

interface IdentifierModuleProps {
  item: any
  i: number
  did: string
}

const IdentifierKey: React.FC<IdentifierModuleProps> = ({ item, i, did }) => {
  const { agent } = useVeramo()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    // simply to prevent this DID from getting messed up accidentally
    if (did === 'did:web:sun.veramo.io') {
      message.error('please do not remove keys from this DID')
    } else {
      agent?.didManagerRemoveKey({ did, kid: item.id })
    }
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <List.Item
      key={i}
      actions={[
        <Button
          icon={<DeleteOutlined />}
          disabled={false /* check if current agent controls this DID */}
          onClick={() => {
            showModal()
          }}
        >
          Remove Key
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<LockOutlined />}
        title={item.type}
        description={shortId(item.controller)}
      />
      {/*item.publicKeyHex*/}
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okType="danger"
      >
        <p>Are you sure you want to remove this key? This cannot be undone.</p>
      </Modal>
    </List.Item>
  )
}

export default IdentifierKey
