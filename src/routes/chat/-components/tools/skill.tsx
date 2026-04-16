import { ScrollText } from "lucide-react"
import { ToolError, ToolLoading } from "./tool"

function ToolStart({
  input,
  callId,
}: {
  input: { name: string }
  callId: string
}) {
  void callId
  return (
    <ToolLoading
      searchString="Reading skill content for"
      toolName="Skill Reader"
      query={input.name}
    />
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: { name: string; content: string } | { error: string }
  callId: string
}) {
  void callId
  if ("error" in output) {
    return <ToolError toolName="Skill Reader" error={output.error} />
  }

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <ScrollText className="mr-2" />
        <span className="font-semibold">Read: {output.name}</span>
      </p>
    </div>
  )
}

export { ToolStart, ToolResult }
