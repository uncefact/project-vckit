import React, { useState } from 'react'
import { Button, Card, List } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import IdentifierService from './IdentifierService'
import AddServiceModalForm, {
  AddServiceModalValues,
} from './AddServiceModalForm'

interface IdentifierModuleProps {
  title: string
  identifier: string
  cacheKey: any
  isManaged?: boolean
}

const IdentifierServices: React.FC<IdentifierModuleProps> = ({
  title,
  identifier,
  cacheKey,
  isManaged = false,
}) => {
  const { agent } = useVeramo()
  const { data, isLoading } = useQuery(
    [cacheKey],
    () => agent?.resolveDid({ didUrl: identifier }),
    { enabled: !!identifier },
  )
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = (values: AddServiceModalValues) => {
    agent?.didManagerAddService({ did: identifier, service: values })
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const actions = isManaged
    ? [<Button onClick={() => showModal()}>Add Service</Button>]
    : []
  return (
    <Card
      size="small"
      title={title}
      style={{ flexWrap: 'wrap' }}
      loading={isLoading}
      actions={actions}
    >
      <AddServiceModalForm
        visible={isModalVisible}
        onAdd={handleOk}
        onCancel={() => {
          handleCancel()
        }}
      />
      <List
        dataSource={data?.didDocument?.service}
        renderItem={(item: any, i: number) => {
          return (
            <IdentifierService i={i} item={item} did={data?.didDocument?.id!} />
          )
        }}
      ></List>
    </Card>
  )
}

export default IdentifierServices
