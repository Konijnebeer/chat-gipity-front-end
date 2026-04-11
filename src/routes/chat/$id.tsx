import { createFileRoute } from "@tanstack/react-router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { IconComponent } from "#/components/icon"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "#/components/ui/avatar"
import { useAgentsQuery } from "#/hooks/query/agents.query"
import { useBreadcrumbContext } from "#/hooks/breadcrumb.context"
import { usePromptForm } from "#/hooks/prompt.form"
import { FieldGroup } from "#/components/ui/field"
import { toast } from "sonner"
import { ChatHistory, ChatHistorySkeleton } from "./-components/history"
import {
  MessageRequestSchema,
  type AgentResponse,
  type MessageResponse,
} from "@chat-gipity/schemas"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip"
import { fetchWithAuth } from "#/lib/api"

export const Route = createFileRoute("/chat/$id")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Chat",
      },
    ],
  }),
  component: RouteComponent,
})

function useChat(id: string) {
  const queryClient = useQueryClient()
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null)
  const activeStreamControllerRef = useRef<AbortController | null>(null)

  const historyQuery = useQuery({
    queryKey: ["chatHistory", id],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/chat/${id}`)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch chat history with status ${response.status}`
        )
      }

      const data = (await response.json()) as {
        name?: string
        agents?: AgentResponse[]
        messages: MessageResponse[]
      }
      return data
    },
  })

  const stopStreaming = useCallback(() => {
    activeStreamControllerRef.current?.abort()
    activeStreamControllerRef.current = null
    setStreamingMessage(null)
    void queryClient.invalidateQueries({ queryKey: ["chatHistory", id] })
  }, [id, queryClient])

  const sendMessage = useCallback(
    async (content: string, sender?: string) => {
      let requestedAgentId: string | null = null
      // Currently broken @ts-expect-error
      // queryClient.setQueryData<MessageResponse[]>(['chatHistory', id], (prev = []) => [
      //   ...prev,
      //   { role: 'user', content },
      // ])

      try {
        const streamController = new AbortController()
        activeStreamControllerRef.current = streamController
        setStreamingMessage("")

        const response = await fetch(
          `/api/chat/${id}/message${sender ? `/${sender}` : ""}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
            signal: streamController.signal,
          }
        )

        if (!response.ok || !response.body) {
          throw new Error(`Chat request failed with status ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            if (!line.startsWith("data: ")) {
              continue
            }

            const payload = line.slice(6).trim()
            if (payload.includes("[REQUEST]")) {
              const requestData = JSON.parse(payload.slice(9).trim()) as {
                id: string
              }
              requestedAgentId = requestData.id
              continue
            }
            if (payload === "[DONE]") {
              break
            }

            const parsed = JSON.parse(payload) as {
              token?: string
              error?: string
            }
            if (parsed.error) {
              throw new Error(parsed.error)
            }

            if (parsed.token) {
              setStreamingMessage((prev) => (prev ?? "") + parsed.token)
            }
          }
        }

        await queryClient.invalidateQueries({ queryKey: ["chatHistory", id] })
        // If an agent requested another agent call, trigger a follow-up response.
        if (requestedAgentId && !streamController.signal.aborted) {
          console.log(
            `Triggering message from requested agent ${requestedAgentId}`
          )
          void sendMessage("", requestedAgentId)
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }

        const message =
          error instanceof Error
            ? error.message
            : "Failed to send chat request. Please try again."
        toast.error(message)
        console.error("Chat API error:", error)
      } finally {
        activeStreamControllerRef.current = null
        setStreamingMessage(null)
      }
    },
    [id, queryClient]
  )

  return { historyQuery, streamingMessage, sendMessage, stopStreaming }
}

function RouteComponent() {
  const { id } = Route.useParams()
  const { setEntity, clearEntity, setHeaderRight, clearHeaderRight } =
    useBreadcrumbContext()
  const { historyQuery, streamingMessage, sendMessage, stopStreaming } =
    useChat(id)
  const agentsQuery = useAgentsQuery()
  const agents = agentsQuery.data ?? []

  const currentChatAgents = historyQuery.data?.agents ?? []
  const headerKey = useMemo(
    () =>
      `chat-agents:${id}:${currentChatAgents.map((agent) => agent.id).join(",")}`,
    [currentChatAgents, id]
  )

  const headerAgentsNode = useMemo(() => {
    if (!currentChatAgents.length) {
      return null
    }

    return <ChatHeaderAgents agents={currentChatAgents} />
  }, [currentChatAgents])

  const chatForm = usePromptForm({
    defaultValues: {
      content: "",
    },
    validators: {
      onSubmitAsync: MessageRequestSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        chatForm.reset()
        await sendMessage(value.content)
      } catch (error) {
        toast.error("Failed to send chat request. Please try again.")
        console.error("Chat API error:", error)
      }
    },
  })

  // On first load, get the first chat from the session storage and call the send message function
  useEffect(() => {
    const initialMessage = sessionStorage.getItem(`initialMessage:${id}`)
    if (initialMessage) {
      void sendMessage(initialMessage)
      // Then delete the session storage item so it doesn't interfere with future messages
      sessionStorage.removeItem(`initialMessage:${id}`)
    }
  }, [id, sendMessage])

  useEffect(() => {
    if (historyQuery.data?.name) {
      setEntity({
        type: "chat",
        id,
        name: historyQuery.data.name,
      })
    }

    return () => {
      clearEntity("chat")
    }
  }, [clearEntity, historyQuery.data?.name, id, setEntity])

  useEffect(() => {
    if (!headerAgentsNode) {
      return
    }

    setHeaderRight({
      key: headerKey,
      node: headerAgentsNode,
    })

    return () => {
      clearHeaderRight(headerKey)
    }
  }, [clearHeaderRight, headerAgentsNode, headerKey, setHeaderRight])

  const isPending = chatForm.state.isSubmitting || streamingMessage !== null

  return (
    <main className="flex h-[calc(100dvh-4rem)] min-h-0 w-full flex-col px-4 pb-16">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {historyQuery.isPending && <ChatHistorySkeleton />}
        {historyQuery.isError && (
          <div className="text-destructive">
            Failed to load chat history. Please try again.
          </div>
        )}
        {historyQuery.data && (
          <ChatHistory
            messages={historyQuery.data.messages}
            streamingMessage={streamingMessage}
          />
        )}
      </div>
      <form
        id="chat-form"
        className="mx-auto mt-4 w-full max-w-2xl shrink-0"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void chatForm.handleSubmit()
        }}
      >
        <FieldGroup>
          <chatForm.AppField
            name="content"
            children={(field) => (
              <field.PromptInputField
                placeholder="Type your message here..."
                maxLength={
                  MessageRequestSchema.shape.content.maxLength ?? undefined
                }
                isPending={isPending}
                onStop={stopStreaming}
                agents={agents}
              />
            )}
          />
        </FieldGroup>
      </form>
    </main>
  )
}

export function ChatHeaderAgents({ agents }: { agents: AgentResponse[] }) {
  const maxVisibleAgents = 4
  const visibleAgents = agents.slice(0, maxVisibleAgents)
  const hiddenCount = Math.max(0, agents.length - maxVisibleAgents)

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <AvatarGroup>
        {visibleAgents.map((agent) => (
          <Tooltip key={agent.id}>
            <TooltipTrigger>
              <Avatar key={agent.id} className="ring-2 ring-sidebar">
                <AvatarFallback
                  style={
                    agent.color
                      ? {
                          borderColor: agent.color,
                        }
                      : undefined
                  }
                >
                  <IconComponent
                    iconName={agent.icon || ""}
                    color={agent.color}
                    className="size-4"
                  />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{agent.name}</TooltipContent>
          </Tooltip>
        ))}
        {hiddenCount > 0 && <AvatarGroupCount>+{hiddenCount}</AvatarGroupCount>}
      </AvatarGroup>
    </div>
  )
}
