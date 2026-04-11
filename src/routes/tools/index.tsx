import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent } from "#/components/ui/card"
import { Skeleton } from "#/components/ui/skeleton"
import { useToolsQuery } from "#/hooks/query/tools.query"
import { AlertTriangle, Wrench } from "lucide-react"
import { IconComponent } from "#/components/icon"

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      {
        title: "Chat Gipity | Tools",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const toolsQuery = useToolsQuery()
  const tools = toolsQuery.data ?? []

  if (toolsQuery.isPending) {
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

  if (toolsQuery.isError) {
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
              <p className="text-sm">Failed to load tools. Please try again.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          return (
            <Card className="h-full gap-0 py-0">
              <CardContent className="space-y-4 py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border p-2">
                    <IconComponent
                      iconName={tool.icon || ""}
                      fallBackIcon={<Wrench />}
                    />
                  </div>
                  <h2 className="text-base font-semibold">{tool.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                <pre>
                  {tool.inputFormat && (
                    <>
                      <strong>Input Format:</strong>
                      <br />
                      {tool.inputFormat}
                      {/* {JSON.parse(tool.inputFormat)} */}
                    </>
                  )}
                  <br />
                  {tool.outputFormat && (
                    <>
                      <strong>Output Format:</strong>
                      <br />
                      {tool.outputFormat}
                      {/* {JSON.parse(tool.outputFormat)} */}
                    </>
                  )}
                </pre>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
