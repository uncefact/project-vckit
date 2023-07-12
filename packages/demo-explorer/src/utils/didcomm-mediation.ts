import { IDIDCommMessage } from '@veramo/did-comm'
import { v4 } from 'uuid'

const MEDIATE_REQUEST_MESSAGE_TYPE =
  'https://didcomm.org/coordinate-mediation/2.0/mediate-request'
const STATUS_REQUEST_MESSAGE_TYPE =
  'https://didcomm.org/messagepickup/3.0/status-request'
export const DELIVERY_REQUEST_MESSAGE_TYPE =
  'https://didcomm.org/messagepickup/3.0/delivery-request'

function createMediateRequestMessage(
  recipientDidUrl: string,
  mediatorDidUrl: string,
): IDIDCommMessage {
  return {
    type: MEDIATE_REQUEST_MESSAGE_TYPE,
    from: recipientDidUrl,
    to: mediatorDidUrl,
    id: v4(),
    return_route: 'all',
    created_time: new Date().toISOString(),
    body: {},
  }
}

function createStatusRequestMessage(
  recipientDidUrl: string,
  mediatorDidUrl: string,
): IDIDCommMessage {
  return {
    id: v4(),
    type: STATUS_REQUEST_MESSAGE_TYPE,
    to: mediatorDidUrl,
    from: recipientDidUrl,
    return_route: 'all',
    body: {},
  }
}

function deliveryRequestMessage(
  recipientDidUrl: string,
  mediatorDidUrl: string,
): IDIDCommMessage {
  return {
    id: v4(),
    type: DELIVERY_REQUEST_MESSAGE_TYPE,
    to: mediatorDidUrl,
    from: recipientDidUrl,
    return_route: 'all',
    body: { limit: 2 },
  }
}

async function pickup(
  agent: any,
  recipientDidUrl: string,
  mediatorDidUrl: string,
): Promise<void> {
  const statusMessage = createStatusRequestMessage(
    recipientDidUrl,
    mediatorDidUrl,
  )

  // console.log("statusMessage: ", statusMessage)
  const packedStatusMessage = await agent.packDIDCommMessage({
    packing: 'authcrypt',
    message: statusMessage,
  })
  // console.log("packedStatusMessage: ", packedStatusMessage)
  await agent.sendDIDCommMessage({
    messageId: statusMessage.id,
    packedMessage: packedStatusMessage,
    recipientDidUrl: mediatorDidUrl,
  })
  // console.log('status: ', status)

  const deliveryMessage = deliveryRequestMessage(
    recipientDidUrl,
    mediatorDidUrl,
  )

  const packedMessage = await agent.packDIDCommMessage({
    packing: 'authcrypt',
    message: deliveryMessage,
  })
  await agent.sendDIDCommMessage({
    messageId: deliveryMessage.id,
    packedMessage,
    recipientDidUrl: mediatorDidUrl,
  })
  // console.log('result: ', result)
}

export { createMediateRequestMessage, createStatusRequestMessage, pickup }
