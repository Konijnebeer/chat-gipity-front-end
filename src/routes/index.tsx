import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAgentsQuery } from "#/hooks/agents.query"
import { usePromptForm } from "#/hooks/prompt.form"
import { FieldGroup } from "#/components/ui/field"
import { toast } from "sonner"
import { type MessageRequest, MessageRequestSchema, type ChatResponse, ChatResponseSchema} from "@chat-gipity/schemas"

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [lastMessageValue, setLastMessageValue] = useState<MessageRequest | null>(null)
  const agentsQuery = useAgentsQuery()
  const agents = agentsQuery.data ?? []

  const chatMutation = useMutation({
    mutationFn: async (value: MessageRequest) => {
      const response = await fetch('/api/chat/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: value.content }),
      })

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`)
      }

      const data = await response.json() as ChatResponse
      return ChatResponseSchema.parse(data)
    },
    onSuccess: (data) => {
      // set the initial message in session storage so it can be send in the id page
      sessionStorage.setItem(`initialMessage:${data.id}`, lastMessageValue?.content ?? '')
      // Invalidate chatHistory query
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] })
      // Redirect to chat history page with id from response
      navigate({
        to: '/chat/$id',
        params: { id: data.id },
      })
      // console.log('Chat API response:', data)
    },
    onError: (error) => {
      toast.error('Failed to send chat request. Please try again.')
      console.error('Chat API error:', error)
    },
  })

  const chatForm = usePromptForm({
    defaultValues: {
      content: '',
    },
    validators: {
      onSubmitAsync: MessageRequestSchema,
    },
    onSubmit: async ({ value }) => {
      setLastMessageValue(value)
      await chatMutation.mutateAsync(value)
    },
  })

  return (
    <main className="flex h-full w-full flex-col justify-center px-4 py-16">
      <form
        id="chat-form"
        className="mx-auto w-full max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void chatForm.handleSubmit()
        }}
        >
        <FieldGroup>
          <chatForm.AppField name="content"
            children={(field) => (
              <field.PromptInputField
                label="Enter your message"
                placeholder="Type your message here..."
                maxLength={MessageRequestSchema.shape.content.maxLength ?? undefined}
                isPending={chatMutation.isPending}
                agents={agents}
              />
            )}
            />
        </FieldGroup>
      </form>
    </main>
  )
}
