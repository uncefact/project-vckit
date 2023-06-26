import React from 'react'
import { Modal, Form, Input } from 'antd'

export interface AddServiceModalValues {
  id: string
  type: string
  serviceEndpoint: string
  description?: string
}

interface AddServiceModalFormProps {
  visible: boolean
  onAdd: (values: AddServiceModalValues) => void
  onCancel: () => void
}

const AddServiceModalForm: React.FC<AddServiceModalFormProps> = ({
  visible,
  onAdd,
  onCancel,
}) => {
  const [form] = Form.useForm()
  return (
    <Modal
      open={visible}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onAdd(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{}}
      >
        <Form.Item
          name="id"
          label="ID"
          rules={[
            { required: true, message: 'Please input the id of the service!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[
            {
              required: true,
              message: 'Please input the Type of the service!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="serviceEndpoint"
          label="Service Endpoint"
          rules={[
            {
              required: true,
              message: 'Please input the Service Endpoint of the service!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddServiceModalForm
