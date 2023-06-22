import React, { useState } from 'react'
import { Button, Card, List, message } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import IdentifierKey from './IdentifierKey'
import AddKeyModalForm, { AddKeyModalValues } from './AddKeyModalForm'
import CreateAndAddKeyModalForm, {
  CreateAndAddKeyModalValues,
} from './CreateAndAddKeyModalForm'

interface IdentifierModuleProps {
  title: string
  identifier: string
  cacheKey: any
  isManaged?: boolean
}

const IdentifierKeys: React.FC<IdentifierModuleProps> = ({
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
  const { data: kmsOptions } = useQuery(
    ['kms', { agentId: agent?.context.id }],
    () => agent?.keyManagerGetKeyManagementSystems(),
  )

  // Create and Add New Key Modal
  const [isCreateAddModalVisible, setIsCreateAddModalVisible] = useState(false)
  const showCreateAddModal = () => {
    setIsCreateAddModalVisible(true)
  }
  const handleCreateAddOk = async (values: CreateAndAddKeyModalValues) => {
    const { kms, type } = values
    const key = await agent?.keyManagerCreate({ kms, type })
    await agent?.didManagerAddKey({
      did: identifier,
      // @ts-ignore
      key,
    })
    setIsCreateAddModalVisible(false)
  }
  const handleCreateAddCancel = () => {
    setIsCreateAddModalVisible(false)
  }

  // Add Existing Key Modal
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const showAddModal = () => {
    setIsAddModalVisible(true)
  }
  const handleAddOk = async (values: AddKeyModalValues) => {
    message.error('not implemented yet')
    setIsAddModalVisible(false)
  }
  const handleAddCancel = () => {
    setIsAddModalVisible(false)
  }

  const actions = isManaged
    ? [
        <Button onClick={() => showCreateAddModal()}>Create New Key</Button>,
        <Button onClick={() => showAddModal()}>Add Existing Key</Button>,
      ]
    : []

  return (
    <Card
      size="small"
      title={title}
      style={{ flexWrap: 'wrap' }}
      loading={isLoading}
      actions={actions}
    >
      <CreateAndAddKeyModalForm
        visible={isCreateAddModalVisible}
        onCreateAndAdd={handleCreateAddOk}
        onCancel={() => {
          handleCreateAddCancel()
        }}
        kmsOptions={kmsOptions!}
      />
      <AddKeyModalForm
        visible={isAddModalVisible}
        onAdd={handleAddOk}
        onCancel={() => {
          handleAddCancel()
        }}
        kmsOptions={kmsOptions!}
      />
      <List
        dataSource={
          data?.didDocument?.verificationMethod || data?.didDocument?.publicKey
        }
        renderItem={(item: any, i: number) => {
          return (
            <IdentifierKey
              i={i}
              key={i}
              item={item}
              did={data?.didDocument?.id!}
            />
          )
        }}
      ></List>
    </Card>
  )
}

export default IdentifierKeys
