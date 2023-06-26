import React, { useState } from 'react'
import { Typography, Form, Input, Button, Select, Row } from 'antd'
import { issueCredential, claimToObject } from '../../utils/signing'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { IIdentifier } from '@veramo/core'
import { PageContainer } from '@ant-design/pro-components'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}

interface Field {
  type: string
  value: any
}

const IssueCredential: React.FC = () => {
  const { agent } = useVeramo()
  const [claimType, setClaimType] = useState<string>('')
  const [claimValue, setClaimValue] = useState<string>('')
  const [credentialType, setCredentialType] = useState<string>('')
  const [customContext, setCustomContext] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<null | string>()
  const [sending] = useState(false)
  const [issuer, setIssuer] = useState<string>('')
  const [subject, setSubject] = useState<string>()
  const [fields, updateFields] = useState<Field[]>([])
  const [proofFormat, setProofFormat] = useState('jwt')

  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const updateClaimFields = (field: Field) => {
    const claimTypes = fields.map((field: Field) => field.type)
    const newFields = fields.concat([field])
    setErrorMessage(null)

    if (!field.type) {
      setErrorMessage('Enter claim type')
      return
    }

    if (!field.value) {
      setErrorMessage('Enter claim value')
      return
    }

    if (claimTypes.includes(field.type)) {
      setErrorMessage('Claim type already exists')
      return
    }

    updateFields(newFields)
    setClaimValue('')
    setClaimType('')
  }

  // const removeClaimField = (index: number) => {
  //   const updatedClaims = fields.filter((item: any, i: number) => i !== index)
  //   updateFields(updatedClaims)
  // }

  const signVc = async (send?: boolean) => {
    const credential = await issueCredential(
      agent,
      issuer,
      subject,
      fields,
      proofFormat,
      customContext,
      credentialType,
    )

    setIssuer('')
    setSubject('')
    updateFields([])

    if (send) {
      sendVC(credential)
    }
  }

  const sendVC = async (body: any) => {
    try {
      const messageId = uuidv4()
      const message = {
        type: 'veramo.io/chat/v1/basicmessage',
        to: subject as string,
        from: issuer as string,
        id: messageId,
        body: body,
      }
      const packedMessage = await agent?.packDIDCommMessage({
        packing: 'authcrypt',
        message,
      })
      if (packedMessage) {
        console.log(packedMessage)
        await agent?.sendDIDCommMessage({
          messageId: messageId,
          packedMessage,
          recipientDidUrl: subject as string,
        })
      }
    } catch (err) {
      console.error(err)

      agent?.handleMessage({ raw: body.proof.jwt, save: true })
    }
  }

  return (
    <PageContainer>
      <Typography.Text>Credential preview</Typography.Text>
      <br />
      <br />
      <Form {...formItemLayout}>
        <Form.Item>
          <Row>
            <code>
              <pre>{JSON.stringify(claimToObject(fields), null, 2)}</pre>
            </code>
          </Row>
        </Form.Item>
        <Form.Item>
          <Input
            value={subject}
            placeholder="subject DID"
            style={{ width: '60%' }}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Select
            style={{ width: '60%' }}
            loading={identifiersLoading}
            onChange={(e) => setIssuer(e as string)}
            placeholder="issuer DID"
            defaultActiveFirstOption={true}
          >
            {identifiers &&
              identifiers.map((id: IIdentifier) => (
                <Option key={id.did} value={id.did as string}>
                  {id.did}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Input
            value={credentialType}
            placeholder="credential type e.g Profile"
            style={{ width: '60%' }}
            onChange={(e) => setCredentialType(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            value={customContext}
            placeholder="custom context url"
            style={{ width: '60%' }}
            onChange={(e) => setCustomContext(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Select
            style={{ width: '60%' }}
            onChange={(e) => setProofFormat(e as string)}
            placeholder="Proof type"
            defaultActiveFirstOption={true}
          >
            <Option key="jwt" value="jwt">
              jwt
            </Option>
            <Option key="lds" value="lds">
              lds
            </Option>
            <Option
              key="EthereumEip712Signature2021lds"
              value="EthereumEip712Signature2021"
            >
              EthereumEip712Signature2021
            </Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ padding: 15 }}>
          <Form.Item>
            <Input
              placeholder="claim type e.g. 'name'"
              value={claimType}
              style={{ width: '60%' }}
              onChange={(e) => setClaimType(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="claim value e.g. Alice"
              value={claimValue}
              style={{ width: '60%' }}
              onChange={(e) => setClaimValue(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                updateClaimFields({
                  type: claimType,
                  value: claimValue,
                })
              }}
            >
              Add
            </Button>
          </Form.Item>

          <Typography.Text>{errorMessage}</Typography.Text>
        </Form.Item>

        <Form.Item>
          <Row>
            <Button
              type="primary"
              onClick={() => signVc()}
              style={{ marginRight: 5 }}
              disabled={sending || fields.length === 0 || !subject || !issuer}
            >
              Issue
            </Button>
            <Form.Item>
              <Button
                onClick={() => signVc(true)}
                type="primary"
                disabled={sending || fields.length === 0 || !subject || !issuer}
              >
                Issue & Send
              </Button>
            </Form.Item>
          </Row>
        </Form.Item>
      </Form>
    </PageContainer>
  )
}

export default IssueCredential
