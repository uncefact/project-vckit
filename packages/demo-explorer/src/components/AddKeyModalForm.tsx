import React from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { TKeyType } from '@vckit/core'

const { Option } = Select

export interface AddKeyModalValues {
  kid: string
  kms: string
  type: TKeyType
  publicKeyHex: string
  privateKeyHex?: string
}

interface AddKeyModalFormProps {
  visible: boolean
  onAdd: (values: AddKeyModalValues) => void
  onCancel: () => void
  kmsOptions: string[]
}

const AddKeyModalForm: React.FC<AddKeyModalFormProps> = ({
  visible,
  onAdd,
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
      title="Add Public Key to DID"
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
          name="kid"
          label="Key ID"
          rules={[
            { required: true, message: 'Please input the ID of the key!' },
          ]}
        >
          <Input />
        </Form.Item>
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
            <Option key="Ed25519" value="Ed25519">
              Ed25519
            </Option>
            <Option key="Secp256k1" value="Secp256k1">
              Secp256k1
            </Option>
            <Option key="X25519" value="X25519">
              X25519
            </Option>
            <Option key="Bls12381G1" value="Bls12381G1">
              Bls12381G1
            </Option>
            <Option key="Bls12381G2" value="Bls12381G2">
              Bls12381G2
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="publicKeyHex"
          label="Public Key Hex"
          rules={[
            {
              required: true,
              message: 'Please input the Public Key Hex of the key!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="privateKeyHex" label="Private Key Hex (optional)">
          <Input />
        </Form.Item>
        {/* TODO: Add key metadata */}
      </Form>
    </Modal>
  )
}

export default AddKeyModalForm
