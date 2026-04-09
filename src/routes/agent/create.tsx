import { AgentResponseSchema, AgentSchema, type Agent, type AgentResponse } from "@chat-gipity/schemas"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { FieldGroup } from "#/components/ui/field"
import { useAgentForm } from "#/hooks/agent.form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"
import { useMemo } from "react"
import { toast } from "sonner"
import { Spinner } from "#/components/ui/spinner"

export const Route = createFileRoute('/agent/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const iconOptions = useMemo(
    () => iconNames.map((name) => ({ value: name, label: name })) as Array<{ value: IconName; label: string }>,
    [],
  )

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

  const isPending = createForm.state.isSubmitting || createAgentMutation.isPending

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Agent</CardTitle>
          <CardDescription>
            Configure a new agent with name, icon, color, and behavior.
          </CardDescription>
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
                    placeholder="Helpful-Tutor"
                    autocomplete="off"
                  />
                )}
              />

              <div className="flex gap-4">
                <createForm.AppField
                  name="icon"
                  children={(field) => (
                    <field.ComboBoxFieldIcons
                      label="Icon"
                      placeholder="Search an icon"
                      empty="No matching icon found"
                      options={iconOptions}
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

              {/* {createForm.state.values.icon ? (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-muted-foreground">
                  <DynamicIcon
                    name={createForm.state.values.icon as IconName}
                    color={createForm.state.values.color || undefined}
                  />
                  <span>{createForm.state.values.icon}</span>
                </div>
              ) : null} */}

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
