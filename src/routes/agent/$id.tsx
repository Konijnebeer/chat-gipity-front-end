import { IconComponent } from "#/components/icon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/alert-dialog"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Skeleton } from "#/components/ui/skeleton"
import { useBreadcrumbContext } from "#/hooks/breadcrumb.context"
import type { AgentResponse } from "@chat-gipity/schemas"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/agent/$id")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Agent Details",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setEntity, clearEntity } = useBreadcrumbContext()

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

  const agentDetailsQuery = useQuery({
    queryKey: ['agentDetails', id],
    queryFn: async () => {
      const response = await fetch(`/api/agent/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch agent details with status ${response.status}`)
      }

      const data = await response.json() as AgentResponse
      return data
    },
  })

  useEffect(() => {
    if (agentDetailsQuery.data?.name) {
      setEntity({
        type: "agent",
        id,
        name: agentDetailsQuery.data.name,
      })
    }

    return () => {
      clearEntity("agent")
    }
  }, [agentDetailsQuery.data?.name, clearEntity, id, setEntity])

  if (agentDetailsQuery.isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
        <Card>
          <CardHeader className="gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
          </CardContent>
        </Card>
      </main>
    )
  }

  if (agentDetailsQuery.isError || !agentDetailsQuery.data) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Failed to load agent</CardTitle>
            <CardDescription>
              {agentDetailsQuery.error instanceof Error
                ? agentDetailsQuery.error.message
                : "Unknown error"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => agentDetailsQuery.refetch()}>
              Retry
            </Button>
            <Button asChild>
              <Link to="/agent">Back to agents</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const agent = agentDetailsQuery.data

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-full border"
                style={agent.color ? { borderColor: agent.color } : undefined}
              >
                <IconComponent iconName={agent.icon || ""} color={agent.color} />
              </div>
              <div>
                <CardTitle className="text-3xl">{agent.name}</CardTitle>
                <CardDescription>Agent profile details</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/agent">All Agents</Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Agent</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this agent?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The agent and its configuration will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => void deleteAgentMutation.mutateAsync()}
                      disabled={deleteAgentMutation.isPending}
                    >
                      {deleteAgentMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{agent.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Icon</p>
              <p className="text-muted-foreground">{agent.icon || "No icon selected"}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Color</p>
              <p className="text-muted-foreground">{agent.color || "No color selected"}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Agent ID</p>
              <p className="break-all text-muted-foreground">{agent.id}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personality</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{agent.personality}</p>
        </CardContent>
      </Card>
    </main>
  )
}
