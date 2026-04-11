import { Skeleton } from "#/components/ui/skeleton"
import { Message } from "./message"
import type { MessageResponse } from "@chat-gipity/schemas"
import { useEffect, useRef } from "react"

type ChatHistoryProps = {
  messages: MessageResponse[]
  streamingMessage: string | null
}

function ChatHistory({ messages, streamingMessage }: ChatHistoryProps) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages, streamingMessage])
  // console.log("Rendering ChatHistory with messages:", messages, "and streamingMessage:", streamingMessage)
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 py-2 mt-6">
      {messages.map((message, i) => (
        <Message key={i} message={message} />
      ))}
      {streamingMessage !== null && (
        // @ts-expect-error
        <Message message={{ role: "assistant", content: streamingMessage, }} />
      )}
      <div ref={endRef} />
    </div>
  )
}

function ChatHistorySkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 py-2">
      <Skeleton className="h-10 w-3/4 ml-auto rounded-3xl rounded-br-md" />
      <Skeleton className="h-10 w-1/2 mr-auto rounded-3xl rounded-bl-md" />
      <Skeleton className="h-10 w-2/3 ml-auto rounded-3xl rounded-br-md" />
    </div>
  )
}

export { ChatHistory, ChatHistorySkeleton }
