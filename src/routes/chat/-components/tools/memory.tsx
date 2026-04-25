import { Brain, ChevronDown } from "lucide-react"
import { ToolError, ToolLoading } from "./tool"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible"

function SaveMemoryStart({
  input,
  callId,
}: {
  input: { name: string }
  callId: string
}) {
  void callId
  return (
    <ToolLoading
      searchString="Saving information to"
      toolName="Save Memory"
      query={input.name}
    />
  )
}

function SaveMemoryResult({
  output,
  callId,
}: {
  output: { name: string; text: string } | { error: string }
  callId: string
}) {
  void callId
  if ("error" in output) {
    return <ToolError toolName="Save Memory" error={output.error} />
  }

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <Brain className="mr-2" />
        <span className="font-semibold">Saved memory for: {output.name}</span>
      </p>
      <p>{output.text}</p>
    </div>
  )
}

function ReadMemoryStart({
  input,
  callId,
}: {
  input: { name: string }
  callId: string
}) {
  void callId
  return (
    <ToolLoading
      searchString="Reading information from"
      toolName="Read Memory"
      query={input.name}
    />
  )
}

function ReadMemoryResult({
  output,
  callId,
}: {
  output: { name: string; results: string } | { error: string }
  callId: string
}) {
  void callId
  if ("error" in output) {
    return <ToolError toolName="Read Memory" error={output.error} />
  }

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <Brain className="mr-2" />
        <span className="font-semibold">Read memory for: {output.name}</span>
      </p>
      <Collapsible className="mt-1">
        <CollapsibleTrigger className="group/collapsible flex items-center gap-1 font-medium underline-offset-2 hover:underline">
          <span>View Results</span>
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>{output.results}</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export { SaveMemoryStart, SaveMemoryResult, ReadMemoryStart, ReadMemoryResult }
