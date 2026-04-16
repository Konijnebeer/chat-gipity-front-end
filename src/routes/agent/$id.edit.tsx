import {
  AgentResponseSchema,
  AgentSchema,
  type Agent,
  type AgentResponse,
} from "@chat-gipity/schemas"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { FieldGroup } from "#/components/ui/field"
import { useAgentForm } from "#/hooks/form/agent.form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createFileRoute,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router"
import { toast } from "sonner"
import { Spinner } from "#/components/ui/spinner"
import { useAgentDetails } from "./-query/detail.query"
import { Skeleton } from "#/components/ui/skeleton"
import { useToolsQuery } from "#/hooks/query/tools.query"
import { ScrollText, Wrench } from "lucide-react"
import { useSkillsQuery } from "#/hooks/query/skills.query"

export const Route = createFileRoute("/agent/$id/edit")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Edit Agent",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = Route.useNavigate()
  const agentDetailsQuery = useAgentDetails(id)

  if (agentDetailsQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl animate-pulse flex-col gap-4 px-4 py-10">
        <Skeleton className="h-8 w-1/3 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <Skeleton className="h-48 w-full rounded-md" />
      </div>
    )
  }

  if (agentDetailsQuery.isError || !agentDetailsQuery.data) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-10">
        <p className="text-center text-sm text-muted-foreground">
          Failed to load agent details. Please try again.
        </p>
        <Button onClick={() => navigate({ to: "/agent" })}>Go Back</Button>
      </div>
    )
  }

  return <EditAgentForm id={id} initialAgent={agentDetailsQuery.data} />
}

type EditAgentFormProps = {
  id: string
  initialAgent: AgentResponse
}

function EditAgentForm({ id, initialAgent }: EditAgentFormProps) {
  const navigate = Route.useNavigate()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const queryClient = useQueryClient()

  const toolsQuery = useToolsQuery()
  const skillsQuery = useSkillsQuery()

  const deleteAgentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/agent/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete agent with status ${response.status}`)
      }
    },
    onSuccess: async () => {
      toast.success("Agent deleted successfully")
      await queryClient.invalidateQueries({ queryKey: ["agents"] })
      navigate({ to: "/agent" })
    },
    onError: (error) => {
      toast.error("Failed to delete agent. Please try again.")
      console.error("Delete agent error:", error)
    },
  })

  const updateAgentMutation = useMutation({
    mutationFn: async (value: Agent) => {
      const response = await fetch(`/api/agent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })

      if (!response.ok) {
        throw new Error(`Update agent failed with status ${response.status}`)
      }

      const data = (await response.json()) as AgentResponse
      return AgentResponseSchema.parse(data)
    },
    onSuccess: async (data) => {
      toast.success("Agent updated successfully")
      await queryClient.invalidateQueries({ queryKey: ["agents"] })
      await queryClient.invalidateQueries({ queryKey: ["agent", id] })

      navigate({
        to: "/agent/$id",
        params: { id: data.id },
      })
    },
    onError: (error) => {
      toast.error("Failed to update agent. Please try again.")
      console.error("Update agent error:", error)
    },
  })

  const editForm = useAgentForm({
    defaultValues: {
      name: initialAgent.name,
      icon: initialAgent.icon,
      color: initialAgent.color,
      description: initialAgent.description,
      personality: initialAgent.personality,
      // Map tools to be just an array of tool ids for the form
      tools: initialAgent.tools?.map((tool) => tool.id) ?? [],
      skills: initialAgent.skills?.map((skill) => skill.id) ?? [],
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
      await updateAgentMutation.mutateAsync(parsed.data)
    },
  })

  const isPending = editForm.state.isSubmitting || updateAgentMutation.isPending

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Agent</CardTitle>
          <CardDescription>
            Update the agent's details, including name, icon, color, and
            behavior.
          </CardDescription>
          <CardAction>
            <Button
              variant="destructive"
              onClick={() => deleteAgentMutation.mutate()}
              disabled={isPending}
            >
              {deleteAgentMutation.isPending ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete Agent"
              )}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            id="edit-agent-form"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void editForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <editForm.AppField
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
                <editForm.AppField
                  name="icon"
                  children={(field) => (
                    <field.IconPickerField
                      label="Icon"
                      placeholder="Search an icon"
                      empty="No matching icon found"
                    />
                  )}
                />
                <editForm.AppField
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

              <editForm.AppField
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

              <editForm.AppField
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

              <div className="gap-4 lg:flex">
                <editForm.AppField
                  name="tools"
                  children={(field) => (
                    <field.MultiPickerField
                      items={toolsQuery.data || []}
                      fallBackIcon={<Wrench className="size-4" />}
                      label="Tools"
                      placeholder="Search tools"
                      empty="No tools found"
                    />
                  )}
                />

                <editForm.AppField
                  name="skills"
                  children={(field) => (
                    <field.MultiPickerField
                      items={skillsQuery.data || []}
                      fallBackIcon={<ScrollText className="size-4" />}
                      label="Skills"
                      placeholder="Search skills"
                      empty="No skills found"
                    />
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              canGoBack ? router.history.back() : navigate({ to: "/agent" })
            }
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-agent-form" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Saving..." : "Save Agent"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
