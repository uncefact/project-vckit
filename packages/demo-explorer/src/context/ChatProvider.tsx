import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager } from '@veramo/core'
import React, { createContext, useState, useContext, useEffect } from 'react'
import { pickup } from '../utils/didcomm-mediation'

const ChatContext = createContext<any>({})

const ChatProvider = (props: any) => {
  const [selectedDid, setSelectedDid] = useState()
  const [composing, setComposing] = useState(false)
  const [newRecipient, setNewRecipient] = useState()

  const MINUTE_MS = 6000
  const { agent } = useVeramo<IDIDManager>()

  useEffect(() => {
    const checkMyDIDs = async () => {
      if (
        agent?.availableMethods().includes('packDIDCommMessage') &&
        agent?.availableMethods().includes('sendDIDCommMessage')
      ) {
        const myDIDs = (await agent?.didManagerFind())
          .filter((did) =>
            did.keys.some(
              (key) => key.type === 'X25519' || key.type === 'Ed25519',
            ),
          )
          .filter((did) =>
            did.services.some((service) => service.type === 'DIDCommMessaging'),
          )

        if (myDIDs && myDIDs.length > 0) {
          for (let d in myDIDs) {
            const did = myDIDs[d].did
            pickup(agent, did, 'did:web:dev-didcomm-mediator.herokuapp.com')
          }
        }
      }
    }
    const interval = setInterval(() => checkMyDIDs(), MINUTE_MS)
    return () => clearInterval(interval)
  }, [agent])

  return (
    <ChatContext.Provider
      value={{
        selectedDid,
        setSelectedDid,
        composing,
        setComposing,
        newRecipient,
        setNewRecipient,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  )
}

const useChat = () => useContext(ChatContext)

export { ChatProvider, useChat }
