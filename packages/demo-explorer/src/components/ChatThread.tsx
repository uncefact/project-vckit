import React from 'react'
import { useNavigate } from 'react-router'
import { useChat } from '../context/ChatProvider'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import ChatThreadProfileHeader from './ChatThreadProfileHeader'

interface ChatThreadProps {
  thread: any
  threadId: string
  threadSelected: boolean
}

const ChatThread: React.FC<ChatThreadProps> = ({
  thread,
  threadId,
  threadSelected,
}) => {
  const { agent } = useVeramo()
  const { selectedDid, setComposing } = useChat()
  const navigate = useNavigate()
  const lastMessage = thread[thread.length - 1]
  const viewThread = () => {
    setComposing(false)
    navigate(`/chats/threads/${threadId}`)
  }

  const counterPartyDid =
    lastMessage.from === selectedDid ? lastMessage.to : lastMessage.from

  const { data: profile } = useQuery(
    ['profile', counterPartyDid, agent?.context.id],
    () =>
      counterPartyDid
        ? agent?.getIdentifierProfile({ did: counterPartyDid })
        : undefined,
  )

  return (
    <ChatThreadProfileHeader
      did={counterPartyDid}
      profile={profile}
      onRowClick={viewThread}
      selected={threadSelected}
      lastMessage={lastMessage}
    />
  )
}

export default ChatThread
