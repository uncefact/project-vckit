import React from 'react'
import { Modal, Form, Select } from 'antd'
import { TKeyType } from '@vckit/core'

const { Option } = Select

export interface CreateAndAddKeyModalValues {
  kms: string
  type: TKeyType
}

interface CreateAndAddKeyModalFormProps {
  visible: boolean
  onCreateAndAdd: (values: CreateAndAddKeyModalValues) => void
  onCancel: () => void
  kmsOptions: string[]
}

const CreateAndAddKeyModalForm: React.FC<CreateAndAddKeyModalFormProps> = ({
  visible,
  onCreateAndAdd,
  onCancel,
  kmsOptions,
}) => {
  const [form] = Form.useForm()

  const onTypeChange = (value: string) => {
    form.setFieldsValue({ type: value })
  }
  const onKmsChange = (value: string) => {
    form.setFieldsValue({ kms: value })
  }
  return (
    <Modal
      open={visible}
      title="Create New Key and add to this DID"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreateAndAdd(values)
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
          name="kms"
          label="Key Management System"
          rules={[
            { required: true, message: 'Please input the KMS of the key!' },
          ]}
        >
          <Select
            placeholder="Select KMS to Use"
            onChange={onKmsChange}
            allowClear
          >
            {kmsOptions?.map((kms) => {
              return (
                <Option value={kms} key={kms}>
                  {kms}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[
            { required: true, message: 'Please select the TYPE of the key!' },
          ]}
        >
          <Select
            placeholder="Select a type of key"
            onChange={onTypeChange}
            allowClear
          >
            <Option value="Ed25519">Ed25519</Option>
            <Option value="Secp256k1">Secp256k1</Option>
            <Option value="X25519">X25519</Option>
            <Option value="Bls12381G1">Bls12381G1</Option>
            <Option value="Bls12381G2">Bls12381G2</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateAndAddKeyModalForm
