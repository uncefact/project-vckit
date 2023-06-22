import React, { useState } from 'react'
import { Alert, Button, Card } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { createMediateRequestMessage } from '../utils/didcomm-mediation'

interface IdentifierQuickSetupProps {
  title: string
  identifier: string
  cacheKey: any
}

const IdentifierQuickSetup: React.FC<IdentifierQuickSetupProps> = ({
  title,
  identifier,
  cacheKey,
}) => {
  const { agent } = useVeramo()
  const { data, isLoading } = useQuery(
    [cacheKey],
    () => agent?.didManagerFind({ provider: 'did:web' }),
    { enabled: !!identifier },
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [enabled, setIsEnabled] = useState(true)

  const handleQuickSetup = async () => {
    setIsEnabled(false)
    if (identifier.startsWith('did:peer')) {
      const message = createMediateRequestMessage(
        identifier,
        'did:web:dev-didcomm-mediator.herokuapp.com',
      )

      const stored = await agent?.dataStoreSaveMessage({ message })
      console.log('stored?: ', stored)

      const packedMessage = await agent?.packDIDCommMessage({
        packing: 'authcrypt',
        message,
      })

      // requests mediation, and then message handler adds service to DID
      const result = await agent?.sendDIDCommMessage({
        packedMessage,
        messageId: message.id,
        recipientDidUrl: 'did:web:dev-didcomm-mediator.herokuapp.com',
      })
      console.log('result: ', result)
    } else {
      try {
        // TODO: check if this key already exists and is managed by this agent
        const key = await agent?.keyManagerCreate({
          kms: 'local',
          type: 'X25519',
        })
        await agent?.didManagerAddKey({
          did: identifier,
          // @ts-ignore
          key,
        })

        if (!data || !(data.length > 0)) {
          // no did:web found, probably using a web3 wallet, set them up with a mediator
          const message = createMediateRequestMessage(
            identifier,
            'did:web:dev-didcomm-mediator.herokuapp.com',
          )

          const stored = await agent?.dataStoreSaveMessage({ message })
          console.log('stored?: ', stored)

          const packedMessage = await agent?.packDIDCommMessage({
            packing: 'authcrypt',
            message,
          })

          // requests mediation, and then message handler adds service to DID
          const result = await agent?.sendDIDCommMessage({
            packedMessage,
            messageId: message.id,
            recipientDidUrl: 'did:web:dev-didcomm-mediator.herokuapp.com',
          })
          console.log('result: ', result)
          // const handled = await agent?.handleMessage({ me})
        } else {
          const serviceEndpoint = data[0].services.find(
            (e: any) => e.type === 'DIDCommMessaging',
          ).serviceEndpoint
          await agent?.didManagerAddService({
            did: identifier,
            service: {
              id: `${identifier}-didcomm-messaging`,
              type: 'DIDCommMessaging',
              serviceEndpoint,
            },
          })
        }
      } catch (err) {
        console.log('err: ', err)
        setErrorMessage(
          'Unable to setup DIDCommMessaging service. If this is a did:ethr, make sure the controlling blockchain account has enough funds to update the DID Document.',
        )
      }
    }
    setIsEnabled(true)
  }

  return (
    <Card
      size="small"
      title={title}
      style={{ flexWrap: 'wrap' }}
      loading={isLoading}
      actions={[
        <Button disabled={!enabled} onClick={() => handleQuickSetup()}>
          Setup DIDComm
        </Button>,
      ]}
    >
      Create and add DIDComm appropriate Key to DIDDoc and add DIDComm Messaging
      Endpoint to DIDDoc
      {errorMessage && <Alert message={errorMessage} type="error" />}
    </Card>
  )
}

export default IdentifierQuickSetup
