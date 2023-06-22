import React, { useState } from 'react'
import { Form, Input, Button, Col, Row, Card, Checkbox, Alert } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQueryClient } from 'react-query'
import { ICredentialRequestInput, Issuer } from '@veramo/selective-disclosure'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import DIDDiscoveryBar from './DIDDiscoveryBar'

interface CreateRequestProps {}

interface SDRArgs {
  issuer: string
  subject?: string
  claims: ICredentialRequestInput[]
  replyUrl?: string
}

interface AddClaimArgs {
  claimType: string
  claimValue?: string
  issuers?: Issuer[]
  essential: boolean
  reason?: string
}

const CreateRequest: React.FC<CreateRequestProps> = () => {
  const { agent } = useVeramo()
  const query = useQueryClient()
  const [subject, setSubject] = useState<string>('')
  const [issuer, setIssuer] = useState<string>('')
  const [claimType, setClaimType] = useState<string>('')
  const [claimValue, setClaimValue] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [claimRequired, setClaimRequired] = useState<boolean>(false)
  const [requiredIssuers, setRequiredIssuers] = useState<Issuer[]>([])
  const [requiredIssuer, setRequiredIssuer] = useState<string>('')
  const [requiredIssuerUrl, setRequiredIssuerUrl] = useState<string>('')
  const [claims, setClaims] = useState<ICredentialRequestInput[]>([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const addRequiredIssuer = (did: string, url?: string) => {
    setRequiredIssuers((s) => s?.concat([{ did, url: url || '' }]))

    setRequiredIssuer('')
    setRequiredIssuerUrl('')
  }

  const addClaim = (addClaimArgs: AddClaimArgs) => {
    setClaims((s) =>
      s?.concat([
        {
          claimType: addClaimArgs.claimType,
          // claimValue: addClaimArgs.claimValue,
          issuers: addClaimArgs.issuers,
          essential: addClaimArgs.essential,
          reason: addClaimArgs.reason,
        },
      ]),
    )

    setClaimType('')
    setClaimValue('')
    setRequiredIssuers([])
  }

  const createSDR = async (sdrArgs: SDRArgs) => {
    let request
    try {
      request = await agent?.createSelectiveDisclosureRequest({
        data: {
          subject: sdrArgs.subject,
          issuer: sdrArgs.issuer,
          claims: sdrArgs.claims,
        },
      })
    } catch (err) {
      console.error('Error in createSelectiveDisclosureRequest:', err)
      setErrorMessage(
        'Error Creating Selecting Disclosure Request. Please ensure that the DID used to issue this SDR has a "Secp256k1" signing key available. Check Logs.',
      )
    }

    if (request) {
      await agent?.handleMessage({ raw: request, save: true })
      query.invalidateQueries(['requests'])
    }

    setIssuer('')
    setSubject('')
    setClaims([])

    if (subject && request) {
      const messageId = uuidv4()
      const message = {
        type: 'veramo.io/chat/v1/basicmessage',
        to: subject as string,
        from: issuer as string,
        id: messageId,
        body: request,
      }
      let packedMessage
      try {
        packedMessage = await agent?.packDIDCommMessage({
          packing: 'authcrypt',
          message,
        })
      } catch (err) {
        console.error('Error in packDIDCommMessage. err: ', err)
        setErrorMessage('Error in sendDIDCommMessage. Check Logs.')
      }
      if (packedMessage) {
        try {
          await agent?.sendDIDCommMessage({
            messageId: messageId,
            packedMessage,
            recipientDidUrl: subject as string,
          })
        } catch (err) {
          console.error('Error in sendDIDCommMessage. err: ', err)
          setErrorMessage('Error in sendDIDCommMessage. Check Logs.')
        }
      }
    }
  }

  return (
    <Card
      title={
        <Row gutter={10} align="middle">
          <Col>
            <Button
              size="small"
              icon={panelOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
              type="primary"
              onClick={() => setPanelOpen((s) => !s)}
            />
          </Col>
          <Col flex={1}>Create Selective Disclosure Request</Col>
        </Row>
      }
    >
      {panelOpen && (
        <Form layout="vertical">
          <pre>
            <code>{JSON.stringify(claims, null, 2)}</code>
          </pre>
          <Row>
            <Form.Item label="SDR Issuer">
              <DIDDiscoveryBar
                handleSelect={(value: any) => {
                  setIssuer(value)
                }}
              />
            </Form.Item>
            <Form.Item label="SDR Subject">
              <DIDDiscoveryBar
                handleSelect={(value: any) => {
                  setSubject(value)
                }}
              />
            </Form.Item>
          </Row>

          <Card>
            <Row>
              <Form.Item label="Claim type">
                <Input
                  value={claimType}
                  type="text"
                  style={{ width: 250, marginRight: 15 }}
                  onChange={(e) => setClaimType(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Claim value">
                <Input
                  value={claimValue}
                  type="text"
                  style={{ width: 250 }}
                  onChange={(e) => setClaimValue(e.target.value)}
                />
              </Form.Item>
            </Row>

            <Row>
              <Form.Item label="Reason">
                <Input
                  value={reason}
                  type="text"
                  style={{ width: 500 }}
                  onChange={(e) => setReason(e.target.value)}
                />
              </Form.Item>
            </Row>
            <pre>
              <code>{JSON.stringify(requiredIssuers, null, 2)}</code>
            </pre>
            <Card>
              <Row>
                <Form.Item label="Credential Issuer">
                  <DIDDiscoveryBar
                    handleSelect={(e: any) => {
                      setRequiredIssuer(e)
                      setRequiredIssuerUrl(e)
                    }}
                  />
                </Form.Item>
              </Row>
              <Button
                type="ghost"
                disabled={!requiredIssuer}
                onClick={() =>
                  addRequiredIssuer(requiredIssuer, requiredIssuerUrl)
                }
              >
                Add issuer
              </Button>
            </Card>
            <Button
              type="ghost"
              disabled={!claimType}
              onClick={() =>
                addClaim({
                  claimType,
                  claimValue,
                  issuers: requiredIssuers,
                  essential: claimRequired,
                  reason,
                })
              }
            >
              Add claim
            </Button>
            <Checkbox
              value={claimRequired}
              style={{ marginLeft: 15 }}
              onChange={(e) => setClaimRequired(e.target.checked)}
            >
              Required claim
            </Checkbox>
          </Card>
          <Button
            type="primary"
            disabled={claims.length === 0 || !issuer}
            onClick={() =>
              createSDR({
                issuer,
                subject,
                claims: claims || [],
                replyUrl: '',
              })
            }
          >
            Create request
          </Button>
        </Form>
      )}
      {errorMessage && (
        <>
          <br />
          <br />
          <Alert message={errorMessage} type="error" />
        </>
      )}
    </Card>
  )
}

export default CreateRequest
