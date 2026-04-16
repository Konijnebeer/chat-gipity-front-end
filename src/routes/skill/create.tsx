import {
  SkillResponseSchema,
  SkillSchema,
  type Skill,
  type SkillResponse,
} from "@chat-gipity/schemas"
import { Button } from "#/components/ui/button"
import {
  // CardAction,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
// import { Badge } from "#/components/ui/badge"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "#/components/ui/dialog"
import { FieldGroup } from "#/components/ui/field"
import { useAgentForm } from "#/hooks/form/agent.form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
// import { FlaskConical, Sparkles } from "lucide-react"
// import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "#/components/ui/spinner"

export const Route = createFileRoute("/skill/create")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Create Skill",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createSkillMutation = useMutation({
    mutationFn: async (value: Skill) => {
      const response = await fetch("/api/skill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })

      if (!response.ok) {
        throw new Error(`Create skill failed with status ${response.status}`)
      }

      const data = (await response.json()) as SkillResponse
      return SkillResponseSchema.parse(data)
    },
    onSuccess: async (data) => {
      toast.success("Skill created successfully")
      await queryClient.invalidateQueries({ queryKey: ["skills"] })

      navigate({
        to: "/skill/$id",
        params: { id: data.id },
      })
    },
    onError: (error) => {
      toast.error("Failed to create skill. Please try again.")
      console.error("Create skill error:", error)
    },
  })

  const createForm = useAgentForm({
    defaultValues: {
      name: "",
      icon: "",
      description: "",
      content: "",
    },
    validators: {
      // @ts-expect-error
      onSubmitAsync: SkillSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = SkillSchema.safeParse({
        ...value,
        icon: value.icon || undefined,
      })

      if (!parsed.success) {
        toast.error("Please fix the form validation errors.")
        return
      }

      await createSkillMutation.mutateAsync(parsed.data)
    },
  })

  const isPending =
    createForm.state.isSubmitting || createSkillMutation.isPending

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Skill</CardTitle>
          <CardDescription>
            Configure a new skill with name, icon, color, and behavior.
          </CardDescription>
          {/* <CardAction>
            <ModelAgentDialog />
          </CardAction> */}
        </CardHeader>
        <CardContent>
          <form
            id="create-skill-form"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void createForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <div className="flex flex-col gap-4 md:flex-row">
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
              </div>

              <createForm.AppField
                name="description"
                children={(field) => (
                  <field.TextAreaField
                    label="Description"
                    placeholder="Explain what this skill is meant for"
                    maxCharacters={`${SkillSchema.shape.description.maxLength}`}
                    rows={3}
                  />
                )}
              />

              <createForm.AppField
                name="content"
                children={(field) => (
                  <field.TextAreaField
                    label="Content"
                    placeholder="Explain what this skill makes an agent do (Markdown is recommended)"
                    maxCharacters={`${SkillSchema.shape.content.maxLength}`}
                    rows={20}
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
            onClick={() => navigate({ to: "/skill" })}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-skill-form" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Creating..." : "Create Skill"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

// function ModelAgentDialog() {
//   const navigate = useNavigate()
//   const queryClient = useQueryClient()
//   const [open, setOpen] = useState(false)

//   const modelForm = useAgentForm({
//     defaultValues: {
//       request: "",
//     },
//     validators: {
//       onSubmitAsync: AgentCreateRequestSchema,
//     },
//     onSubmit: async ({ value }) => {
//       await createModelAgentMutation.mutateAsync(value.request)
//     },
//   })

//   const createModelAgentMutation = useMutation({
//     mutationFn: async (value: string) => {
//       const parsed = AgentCreateRequestSchema.safeParse({ request: value })
//       if (!parsed.success) {
//         throw new Error("Please provide a valid request for the model.")
//       }

//       const response = await fetch("/api/agent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(parsed.data),
//       })

//       if (!response.ok) {
//         throw new Error(`Create agent failed with status ${response.status}`)
//       }

//       const data = (await response.json()) as AgentResponse
//       return AgentResponseSchema.parse(data)
//     },
//     onSuccess: async (data) => {
//       toast.success("Agent generated successfully")
//       await queryClient.invalidateQueries({ queryKey: ["agents"] })

//       setOpen(false)
//       modelForm.reset()
//       navigate({
//         to: "/agent/$id",
//         params: { id: data.id },
//       })
//     },
//     onError: (error) => {
//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to generate agent. Please try again."
//       toast.error(message)
//       console.error("Generate agent error:", error)
//     },
//   })

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button type="button" variant="outline" size="sm">
//           <Sparkles />
//           Agent Creator
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <div className="flex items-center gap-2">
//             <DialogTitle>Generate Agent</DialogTitle>
//             <Badge variant="secondary">
//               <FlaskConical />
//               <span>Beta</span>
//             </Badge>
//           </div>
//           <DialogDescription>
//             Describe the agent you want. The model will generate name, icon,
//             color, description, and personality.
//           </DialogDescription>
//         </DialogHeader>
//         <form
//           id="model-agent-form"
//           className="space-y-4"
//           onSubmit={(e) => {
//             e.preventDefault()
//             e.stopPropagation()
//             void modelForm.handleSubmit()
//           }}
//         >
//           <FieldGroup>
//             <modelForm.AppField
//               name="request"
//               children={(field) => (
//                 <field.TextAreaField
//                   label="Prompt"
//                   placeholder="Create a cheerful frontend mentor agent that explains React patterns with clear examples and practical tips."
//                   maxCharacters={`${AgentCreateRequestSchema.shape.request.maxLength}`}
//                   rows={6}
//                 />
//               )}
//             />
//           </FieldGroup>
//         </form>
//         <DialogFooter>
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => setOpen(false)}
//             disabled={createModelAgentMutation.isPending}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             form="model-agent-form"
//             disabled={createModelAgentMutation.isPending}
//           >
//             {createModelAgentMutation.isPending && <Spinner />}
//             Generate
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
