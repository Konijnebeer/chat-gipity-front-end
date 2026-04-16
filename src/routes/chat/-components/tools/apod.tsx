import type { ApodQuery, ApodResponse } from "@chat-gipity/schemas"
import { ToolError, ToolLoading } from "./tool"

function ToolStart({ input, callId }: { input: ApodQuery; callId: string }) {
  void callId
  return (
    <ToolLoading
      searchString="Searching for Astronomy Picture of the Day for"
      toolName="APOD Lookup"
      query={input.date}
    />
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: ApodResponse | { error: string }
  callId: string
}) {
  void callId

  if ("error" in output) {
    return <ToolError toolName="APOD Lookup" error={output.error} />
  }

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit max-w-md space-y-2 rounded-md bg-muted/50 p-4 ring-1">
      <p className="text-lg font-semibold">{output.title}</p>
      <p className="text-xs text-muted-foreground">
        {output.date}
        {output.copyright && ` · © ${output.copyright}`}
      </p>
      {output.media_type === "image" ? (
        <img
          src={output.url}
          alt={output.title}
          className="max-h-64 w-full rounded-md object-cover"
        />
      ) : (
        <iframe
          src={output.url}
          title={output.title}
          className="aspect-video w-full rounded-md"
          allowFullScreen
        />
      )}
      <p className="line-clamp-3 text-sm text-muted-foreground">
        {output.explanation}
      </p>
    </div>
  )
}

export { ToolStart, ToolResult }
