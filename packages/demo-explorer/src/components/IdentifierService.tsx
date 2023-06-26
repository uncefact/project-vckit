import React, { useState } from 'react'
import { Button, Modal, List } from 'antd'
import { CloudServerOutlined, DeleteOutlined } from '@ant-design/icons'
import { useVeramo } from '@veramo-community/veramo-react'

interface IdentifierModuleProps {
  i: number
  item: any
  did: string
}

const IdentifierServices: React.FC<IdentifierModuleProps> = ({
  i,
  item,
  did,
}) => {
  const { agent } = useVeramo()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    agent?.didManagerRemoveService({ did, id: item.id })
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const serviceEndpoint = item.serviceEndpoint[0]?.uri || item.serviceEndpoint
  return (
    <List.Item
      key={i}
      actions={[
        <Button
        // @ts-ignore FIXME: why is ts complaining about this?
          icon={<DeleteOutlined />}
          disabled={false /* check if current agent controls this DID */}
          onClick={() => {
            console.log('remove service')
            showModal()
          }}
        >
          Remove Service
        </Button>,
      ]}
    >
      <List.Item.Meta
      // @ts-ignore FIXME: why is ts complaining about this?
        avatar={<CloudServerOutlined />}
        title={item.type}
        description={serviceEndpoint}
      />
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okType="danger"
      >
        <p>Are you sure you want to remove this service?</p>
      </Modal>
    </List.Item>
  )
}

export default IdentifierServices
