import { CalendarClock, ScrollText } from "lucide-react"
import { ToolError, ToolLoading } from "./tool"

function ToolStart({ input, callId }: { input: unknown; callId: string }) {
  void input
  void callId
  return (
    <ToolLoading
      searchString="Checking my watch"
      toolName="Current Date and Time"
    />
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: { date: string; time: string }
  callId: string
}) {
  void callId

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <CalendarClock className="mr-2" />
        <span className="font-semibold">
          It's now: {output.date} - {output.time}
        </span>
      </p>
    </div>
  )
}

export { ToolStart, ToolResult }
