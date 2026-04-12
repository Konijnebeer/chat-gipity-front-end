import { IconComponent } from "#/components/icon"
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
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router"
import { useEffect } from "react"
import { useAgentDetails } from "./-query/detail.query"
import type { SkillResponse, ToolResponse } from "@chat-gipity/schemas"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "#/components/ui/item"
import { ScrollText, Wrench } from "lucide-react"

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
  const location = useLocation()
  const isEditRoute = location.pathname.endsWith("/edit")

  const { setEntity, clearEntity } = useBreadcrumbContext()

  const agentDetailsQuery = useAgentDetails(id)

  useEffect(() => {
    if (!isEditRoute && agentDetailsQuery.data?.name) {
      setEntity({
        type: "agent",
        id,
        name: agentDetailsQuery.data.name,
      })
    }

    return () => {
      clearEntity("agent")
    }
  }, [agentDetailsQuery.data?.name, clearEntity, id, isEditRoute, setEntity])

  if (isEditRoute) {
    return <Outlet />
  }

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
            <Button
              type="button"
              variant="outline"
              onClick={() => agentDetailsQuery.refetch()}
            >
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
                <IconComponent
                  iconName={agent.icon || ""}
                  color={agent.color}
                />
              </div>
              <div>
                <CardTitle className="text-3xl">
                  <h1>{agent.name}</h1>
                </CardTitle>
                <CardDescription>Agent profile details</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/agent">All Agents</Link>
              </Button>
              <Button asChild>
                <Link to="/agent/$id/edit" params={{ id: agent.id }}>
                  Edit Agent
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <h2>Description</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {agent.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Metadata</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Icon</p>
              <p className="text-muted-foreground">
                {agent.icon || "No icon selected"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Color</p>
              <p className="text-muted-foreground">
                {agent.color || "No color selected"}
              </p>
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
          <CardTitle>
            <h2>Personality</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {agent.personality}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Tools & Skills</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold">Tools</h3>
          <ItemDetails
            items={agent.tools || []}
            fallBackIcon={<Wrench />}
            empty="No tools assigned."
          />
          <h3 className="text-lg font-semibold">Skills</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <ItemDetails
              items={agent.skills || []}
              fallBackIcon={<ScrollText />}
              empty="No skills assigned."
            />
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

function ItemDetails({
  items,
  fallBackIcon,
  empty,
}: {
  items: SkillResponse[] | ToolResponse[]
  fallBackIcon: React.ReactNode
  empty: string
}) {
  return (
    <ItemGroup className="pt-2 pb-4 lg:grid lg:grid-cols-2">
      {items.map((item) => (
        <Item key={item.id} variant="muted">
          <ItemMedia>
            <IconComponent
              iconName={item.icon || ""}
              fallBackIcon={fallBackIcon}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{item.name}</ItemTitle>
            <ItemDescription>{item.description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
      {/* fallback */}
      {items.length === 0 && (
        <div className="flex items-center gap-3">
          <div className="rounded-xl border p-2">{fallBackIcon}</div>
          <p className="text-sm text-muted-foreground">{empty}</p>
        </div>
      )}
    </ItemGroup>
  )
}
