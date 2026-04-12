import { Spinner } from "#/components/ui/spinner"
import type { ApodQuery, ApodResponse } from "@chat-gipity/schemas"

function ToolStart({ input, callId }: { input: ApodQuery; callId: string }) {
  void callId
  return (
    <div>
      <p>
        <Spinner className="mr-2" />
        <span>Fetching NASA Astronomy Picture of the Day</span>
        {input.date && <span> for {input.date}</span>}
      </p>
    </div>
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: ApodResponse
  callId: string
}) {
  void callId
  return (
    <div className="my-2 mr-2 inline-block w-fit max-w-md space-y-2 rounded-md bg-muted/50 p-4 ring-1">
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
