import {
  AgentCreateRequestSchema,
  AgentResponseSchema,
  AgentSchema,
  type Agent,
  type AgentResponse,
} from "@chat-gipity/schemas"
import { Button } from "#/components/ui/button"
import {
  CardAction,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Badge } from "#/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog"
import { FieldGroup } from "#/components/ui/field"
import { useAgentForm } from "#/hooks/form/agent.form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FlaskConical, Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "#/components/ui/spinner"

export const Route = createFileRoute("/agent/create")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Create Agent",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createAgentMutation = useMutation({
    mutationFn: async (value: Agent) => {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })

      if (!response.ok) {
        throw new Error(`Create agent failed with status ${response.status}`)
      }

      const data = (await response.json()) as AgentResponse
      return AgentResponseSchema.parse(data)
    },
    onSuccess: async (data) => {
      toast.success("Agent created successfully")
      await queryClient.invalidateQueries({ queryKey: ["agents"] })

      navigate({
        to: "/agent/$id",
        params: { id: data.id },
      })
    },
    onError: (error) => {
      toast.error("Failed to create agent. Please try again.")
      console.error("Create agent error:", error)
    },
  })

  const createForm = useAgentForm({
    defaultValues: {
      name: "",
      icon: "",
      color: "",
      description: "",
      personality: "",
    },
    validators: {
      // @ts-expect-error
      onSubmitAsync: AgentSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = AgentSchema.safeParse({
        ...value,
        icon: value.icon || undefined,
        color: value.color || undefined,
      })

      if (!parsed.success) {
        toast.error("Please fix the form validation errors.")
        return
      }

      await createAgentMutation.mutateAsync(parsed.data)
    },
  })

  const isPending =
    createForm.state.isSubmitting || createAgentMutation.isPending

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Agent</CardTitle>
          <CardDescription>
            Configure a new agent with name, icon, color, and behavior.
          </CardDescription>
          <CardAction>
            <ModelAgentDialog />
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            id="create-agent-form"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void createForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <createForm.AppField
                name="name"
                children={(field) => (
                  <field.InputField
                    label="Name"
                    placeholder="Writing"
                    autocomplete="off"
                  />
                )}
              />

              <div className="flex flex-col gap-4 md:flex-row">
                <createForm.AppField
                  name="icon"
                  children={(field) => (
                    <field.IconPickerField
                      label="Icon"
                      placeholder="Search an icon"
                      empty="No matching icon found"
                    />
                  )}
                />
                <createForm.AppField
                  name="color"
                  children={(field) => (
                    <field.InputField
                      label="Color"
                      placeholder="#22c55e"
                      autocomplete="off"
                    />
                  )}
                />
              </div>

              <createForm.AppField
                name="description"
                children={(field) => (
                  <field.TextAreaField
                    label="Description"
                    placeholder="Explain what this agent is good at"
                    maxCharacters={`${AgentSchema.shape.description.maxLength}`}
                    rows={4}
                  />
                )}
              />

              <createForm.AppField
                name="personality"
                children={(field) => (
                  <field.TextAreaField
                    label="Personality"
                    placeholder="Describe tone, style, and behavior"
                    maxCharacters={`${AgentSchema.shape.personality.maxLength}`}
                    rows={6}
                  />
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/agent" })}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-agent-form" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Creating..." : "Create Agent"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

function ModelAgentDialog() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const modelForm = useAgentForm({
    defaultValues: {
      request: "",
    },
    validators: {
      onSubmitAsync: AgentCreateRequestSchema,
    },
    onSubmit: async ({ value }) => {
      await createModelAgentMutation.mutateAsync(value.request)
    },
  })

  const createModelAgentMutation = useMutation({
    mutationFn: async (value: string) => {
      const parsed = AgentCreateRequestSchema.safeParse({ request: value })
      if (!parsed.success) {
        throw new Error("Please provide a valid request for the model.")
      }

      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      })

      if (!response.ok) {
        throw new Error(`Create agent failed with status ${response.status}`)
      }

      const data = (await response.json()) as AgentResponse
      return AgentResponseSchema.parse(data)
    },
    onSuccess: async (data) => {
      toast.success("Agent generated successfully")
      await queryClient.invalidateQueries({ queryKey: ["agents"] })

      setOpen(false)
      modelForm.reset()
      navigate({
        to: "/agent/$id",
        params: { id: data.id },
      })
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate agent. Please try again."
      toast.error(message)
      console.error("Generate agent error:", error)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Sparkles />
          Agent Creator
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Generate Agent</DialogTitle>
            <Badge variant="secondary">
              <FlaskConical />
              <span>Beta</span>
            </Badge>
          </div>
          <DialogDescription>
            Describe the agent you want. The model will generate name, icon,
            color, description, and personality.
          </DialogDescription>
        </DialogHeader>
        <form
          id="model-agent-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void modelForm.handleSubmit()
          }}
        >
          <FieldGroup>
            <modelForm.AppField
              name="request"
              children={(field) => (
                <field.TextAreaField
                  label="Prompt"
                  placeholder="Create a cheerful frontend mentor agent that explains React patterns with clear examples and practical tips."
                  maxCharacters={`${AgentCreateRequestSchema.shape.request.maxLength}`}
                  rows={6}
                />
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={createModelAgentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="model-agent-form"
            disabled={createModelAgentMutation.isPending}
          >
            {createModelAgentMutation.isPending && <Spinner />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
