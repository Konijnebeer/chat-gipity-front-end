import { ChevronDown, ReceiptText } from "lucide-react"
import { ToolError, ToolLoading } from "./tool"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible"

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
      searchString="Asking sub-agent"
      toolName="Ask Sub Agent"
      query={input.name}
    />
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: { name: string; answer: string } | { error: string }
  callId: string
}) {
  void callId
  if ("error" in output) {
    return <ToolError toolName="Ask Sub Agent" error={output.error} />
  }

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <ReceiptText className="mr-2" />
        <span className="font-semibold">Asked: {output.name}</span>
      </p>
      <Collapsible className="mt-1">
        <CollapsibleTrigger className="group/collapsible flex items-center gap-1 font-medium underline-offset-2 hover:underline">
          <span>View Answer</span>
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>{output.answer}</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export { ToolStart, ToolResult }
