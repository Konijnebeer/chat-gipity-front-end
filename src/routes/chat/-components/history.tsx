import { Skeleton } from "#/components/ui/skeleton"
import type { StreamingBlock } from "../$id"
import { Message, StreamingMessage } from "./message"
import type { MessageResponse } from "@chat-gipity/schemas"
import { useEffect, useRef } from "react"

type ChatHistoryProps = {
  messages: MessageResponse[]
  streamingBlocks: StreamingBlock[] | null
}

function ChatHistory({ messages, streamingBlocks }: ChatHistoryProps) {
  const endRef = useRef<HTMLDivElement | null>(null)
  // console.log("ChatHistory received messages:", messages)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages, streamingBlocks])
  // console.log("Rendering ChatHistory with messages:", messages, "and streamingBlocks:", streamingBlocks)
  return (
    <div className="mx-auto mt-6 flex w-full max-w-4xl flex-col gap-4 py-2">
      {messages.map((message, i) => (
        <Message key={i} message={message} />
      ))}
      {streamingBlocks !== null && (
        <StreamingMessage blocks={streamingBlocks} />
      )}
      <div ref={endRef} />
    </div>
  )
}

function ChatHistorySkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 py-2">
      <Skeleton className="ml-auto h-10 w-3/4 rounded-3xl rounded-br-md" />
      <Skeleton className="mr-auto h-10 w-1/2 rounded-3xl rounded-bl-md" />
      <Skeleton className="ml-auto h-10 w-2/3 rounded-3xl rounded-br-md" />
    </div>
  )
}

export { ChatHistory, ChatHistorySkeleton }
