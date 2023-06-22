import React, { useState } from 'react'
import { Button, Card, Input, Select } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifier } from '@vckit/core'
import { issueCredential } from '../../utils/signing'
import { v4 } from 'uuid'
import { PageContainer } from '@ant-design/pro-components'
const { TextArea } = Input
const { Option } = Select

const CreateProfileCredential: React.FC = () => {
  const { agent } = useVeramo()

  const { data: identifiers, isLoading: identifiersLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )
  const [issuer, setIssuer] = useState<string>('')
  const [proofFormat, setProofFormat] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [recipient, setRecipient] = useState('')
  const [inFlight, setInFlight] = useState(false)

  return (
    <PageContainer>
      <Card>
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
        <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <TextArea placeholder="Bio" onChange={(e) => setBio(e.target.value)} />
        <br />
        <br />
        <Select
          style={{ width: '60%' }}
          onChange={(e) => setProofFormat(e as string)}
          placeholder="Proof type"
          defaultActiveFirstOption={true}
        >
          <Option
            key="EthereumEip712Signature2021lds"
            value="EthereumEip712Signature2021"
          >
            EthereumEip712Signature2021
          </Option>
          <Option key="jwt" value="jwt">
            jwt
          </Option>
          <Option key="lds" value="lds">
            lds
          </Option>
        </Select>
        <br />
        <Input
          placeholder="Recipient DID"
          onChange={(e) => setRecipient(e.target.value)}
        />
        <br />
        <br />
        <Button
          type="primary"
          disabled={inFlight || !proofFormat || !issuer}
          onClick={async () => {
            try {
              setInFlight(true)
              const cred = await issueCredential(
                agent,
                issuer,
                issuer,
                [
                  { type: 'name', value: name },
                  { type: 'bio', value: bio },
                ],
                proofFormat,
                '',
                'ProfileCredentialSchema',
                'did:web:veramo.io;id=62a8ca5d-7e78-4e7b-a2c1-0bf2d37437ad;version=1.0',
              )
              console.log('cred: ', cred)
              if (recipient) {
                const packedMessage = await agent?.packDIDCommMessage({
                  packing: 'none',
                  message: {
                    from: issuer,
                    to: recipient,
                    id: v4(),
                    type: 'w3c.vc',
                    body: cred,
                  },
                })
                console.log('packedMessage: ', packedMessage)
                const res = await agent?.sendDIDCommMessage({
                  messageId: v4(),
                  packedMessage,
                  recipientDidUrl: recipient,
                })
                console.log('res: ', res)
              }
              setInFlight(false)
            } catch (ex) {
              console.error('ex: ', ex)
              setInFlight(false)
            }
          }}
        >
          Create Profile
        </Button>
      </Card>
    </PageContainer>
  )
}

export default CreateProfileCredential
