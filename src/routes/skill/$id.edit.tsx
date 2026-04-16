import {
  SkillResponseSchema,
  SkillSchema,
  type Skill,
  type SkillResponse,
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
import { useSkillForm } from "#/hooks/form/skill.form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createFileRoute,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router"
import { toast } from "sonner"
import { Spinner } from "#/components/ui/spinner"
import { useSkillDetails } from "./-query/detail.query"
import { Skeleton } from "#/components/ui/skeleton"

export const Route = createFileRoute("/skill/$id/edit")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Edit Skill",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = Route.useNavigate()
  const skillDetailsQuery = useSkillDetails(id)

  if (skillDetailsQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl animate-pulse flex-col gap-4 px-4 py-10">
        <Skeleton className="h-8 w-1/3 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <Skeleton className="h-48 w-full rounded-md" />
      </div>
    )
  }

  if (skillDetailsQuery.isError || !skillDetailsQuery.data) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-10">
        <p className="text-center text-sm text-muted-foreground">
          Failed to load skill details. Please try again.
        </p>
        <Button onClick={() => navigate({ to: "/skill" })}>Go Back</Button>
      </div>
    )
  }

  return <EditSkillForm id={id} initialSkill={skillDetailsQuery.data} />
}

type EditSkillFormProps = {
  id: string
  initialSkill: SkillResponse
}

function EditSkillForm({ id, initialSkill }: EditSkillFormProps) {
  const navigate = Route.useNavigate()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const queryClient = useQueryClient()

  const deleteSkillMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/skill/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete skill with status ${response.status}`)
      }
    },
    onSuccess: async () => {
      toast.success("Skill deleted successfully")
      await queryClient.invalidateQueries({ queryKey: ["skills"] })
      navigate({ to: "/skill" })
    },
    onError: (error) => {
      toast.error("Failed to delete skill. Please try again.")
      console.error("Delete skill error:", error)
    },
  })

  const updateSkillMutation = useMutation({
    mutationFn: async (value: Skill) => {
      const response = await fetch(`/api/skill/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })

      if (!response.ok) {
        throw new Error(`Update skill failed with status ${response.status}`)
      }

      const data = (await response.json()) as SkillResponse
      return SkillResponseSchema.parse(data)
    },
    onSuccess: async (data) => {
      toast.success("Skill updated successfully")
      await queryClient.invalidateQueries({ queryKey: ["skills"] })
      await queryClient.invalidateQueries({ queryKey: ["skill", id] })

      navigate({
        to: "/skill/$id",
        params: { id: data.id },
      })
    },
    onError: (error) => {
      toast.error("Failed to update skill. Please try again.")
      console.error("Update skill error:", error)
    },
  })

  const editForm = useSkillForm({
    defaultValues: {
      name: initialSkill.name,
      icon: initialSkill.icon,
      description: initialSkill.description,
      content: initialSkill.content,
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
      await updateSkillMutation.mutateAsync(parsed.data)
    },
  })

  const isPending = editForm.state.isSubmitting || updateSkillMutation.isPending

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Skill</CardTitle>
          <CardDescription>
            Update the skill's details, including name, icon, color, and
            behavior.
          </CardDescription>
          <CardAction>
            <Button
              variant="destructive"
              onClick={() => deleteSkillMutation.mutate()}
              disabled={isPending}
            >
              {deleteSkillMutation.isPending ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete Skill"
              )}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            id="edit-skill-form"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void editForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <div className="flex flex-col gap-4 md:flex-row">
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
              </div>

              <editForm.AppField
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

              <editForm.AppField
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
            onClick={() =>
              canGoBack ? router.history.back() : navigate({ to: "/skill" })
            }
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-skill-form" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Saving..." : "Save Skill"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
