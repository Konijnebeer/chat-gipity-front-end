import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardContent } from "#/components/ui/card"
import { Skeleton } from "#/components/ui/skeleton"
import { useSkillsQuery } from "#/hooks/query/skills.query"
import { AlertTriangle, ScrollText } from "lucide-react"
import { IconComponent } from "#/components/icon"

export const Route = createFileRoute("/skill/")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Skills",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const skillsQuery = useSkillsQuery()
  const skills = skillsQuery.data ?? []

  if (skillsQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-full min-h-30 gap-0 py-0">
              <CardContent className="space-y-4 py-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    )
  }

  if (skillsQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="h-full gap-0 bg-destructive/10 py-0 ring-destructive">
            <CardContent className="space-y-4 py-5 text-destructive">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-destructive p-2">
                  <AlertTriangle className="" />
                </div>
                <h2 className="text-base font-semibold">Error</h2>
              </div>
              <p className="text-sm">
                Failed to load skills. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => {
          return (
            <Link
              key={skill.id}
              to="/skill/$id"
              params={{ id: skill.id }}
              className="block h-full"
            >
              <Card className="h-full gap-0 py-0 transition-transform hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="space-y-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border p-2">
                      <IconComponent
                        iconName={skill.icon || ""}
                        fallBackIcon={<ScrollText />}
                      />
                    </div>
                    <h2 className="text-base font-semibold">{skill.name}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
