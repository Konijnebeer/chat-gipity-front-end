import { ChevronDown, MessageSquareText, UserCheck } from "lucide-react"
import { ToolError, ToolLoading } from "./tool"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible"

function ReadChatHistoryStart({
  input,
  callId,
}: {
  input: { query: string }
  callId: string
}) {
  void callId
  return (
    <ToolLoading
      searchString="Searching for"
      toolName="Read Chat History"
      query={input.query}
    />
  )
}

function ReadChatHistoryResult({
  output,
  callId,
}: {
  output:
    | {
        query: string
        results: string
        sources: string[]
        includeUserMessages: boolean
      }
    | { error: string }
  callId: string
}) {
  void callId
  if ("error" in output) {
    return <ToolError toolName="Read Chat History" error={output.error} />
  }

  return (
    <div className="mt-2 mr-2 mb-2 w-full rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <MessageSquareText className="mr-2" />
        <span className="font-semibold">
          Read chat history for: {output.query}
        </span>
        {output.includeUserMessages && <UserCheck className="ml-auto" />}
      </p>
      {output.sources && output.sources.length > 0 && (
        <Collapsible className="mt-1">
          <CollapsibleTrigger className="group/collapsible flex items-center gap-1 font-medium underline-offset-2 hover:underline">
            <span>View Sources</span>
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
              {output.sources.map((source, i) => (
                <li key={i} className="underline underline-offset-2">
                  {source}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

export { ReadChatHistoryStart, ReadChatHistoryResult }
