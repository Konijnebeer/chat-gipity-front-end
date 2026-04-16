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
import { useSkillDetails } from "./-query/detail.query"
import { ScrollText } from "lucide-react"
import { micromark } from "micromark"
import { gfm, gfmHtml } from "micromark-extension-gfm"

export const Route = createFileRoute("/skill/$id")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Skill Details",
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

  const skillDetailsQuery = useSkillDetails(id)

  useEffect(() => {
    if (skillDetailsQuery.data?.name) {
      setEntity({
        type: "skill",
        id,
        name: skillDetailsQuery.data.name,
      })
    }

    return () => {
      clearEntity("skill")
    }
  }, [skillDetailsQuery.data?.name, clearEntity, id, isEditRoute, setEntity])

  if (isEditRoute) {
    return <Outlet />
  }

  if (skillDetailsQuery.isLoading) {
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

  if (skillDetailsQuery.isError || !skillDetailsQuery.data) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Failed to load skill</CardTitle>
            <CardDescription>
              {skillDetailsQuery.error instanceof Error
                ? skillDetailsQuery.error.message
                : "Unknown error"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => skillDetailsQuery.refetch()}
            >
              Retry
            </Button>
            <Button asChild>
              <Link to="/skill">Back to skills</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const skill = skillDetailsQuery.data

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full border">
                <IconComponent
                  iconName={skill.icon || ""}
                  fallBackIcon={<ScrollText />}
                />
              </div>
              <div>
                <CardTitle className="text-3xl">
                  <h1>{skill.name}</h1>
                </CardTitle>
                <CardDescription>Skill profile details</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/skill">All Skills</Link>
              </Button>
              <Button asChild>
                <Link to="/skill/$id/edit" params={{ id: skill.id }}>
                  Edit Skill
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
              {skill.description}
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
                {skill.icon || "No icon selected"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-medium">Skill ID</p>
              <p className="break-all text-muted-foreground">{skill.id}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Content</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{
                __html: micromark(skill.content, {
                  extensions: [gfm()],
                  htmlExtensions: [gfmHtml()],
                }),
              }}
            />
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
