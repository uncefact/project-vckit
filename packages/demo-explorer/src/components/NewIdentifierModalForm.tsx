import React from 'react'
import { Modal, Form, Input, Select } from 'antd'
const { Option } = Select

export interface NewIdentifierModalValues {
  provider: string
  alias: string
}

interface NewIdentifierModalFormProps {
  visible: boolean
  onNewIdentifier: (values: NewIdentifierModalValues) => void
  onCancel: () => void
  providers: string[]
}

const NewIdentifierModalForm: React.FC<NewIdentifierModalFormProps> = ({
  visible,
  onNewIdentifier,
  onCancel,
  providers,
}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      open={visible}
      title="Create new Identifier"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onNewIdentifier(values)
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
        <Form.Item name="alias" label="Alias">
          <Input />
        </Form.Item>
        <Form.Item
          name="provider"
          label="Identifier Provider"
          rules={[
            { required: true, message: 'Please select Idenifier Provider!' },
          ]}
        >
          <Select
            placeholder="Provider"
            onChange={(value) => form.setFieldsValue({ provider: value })}
            allowClear
          >
            {providers?.map((provider) => {
              return (
                <Option value={provider} key={provider}>
                  {provider}
                </Option>
              )
            })}
          </Select>
        </Form.Item>

        {/* TODO: Add key kms */}
      </Form>
    </Modal>
  )
}

export default NewIdentifierModalForm
