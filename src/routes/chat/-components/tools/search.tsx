import { ChevronDown, SearchCheck } from "lucide-react"
import { ToolError, ToolLoading } from "./tool"
import type { SearchResponse } from "@chat-gipity/schemas"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible"

function ToolStart({
  input,
  callId,
}: {
  input: { query: string }
  callId: string
}) {
  void callId
  return (
    <ToolLoading
      toolName="Brave Search"
      searchString="Searching for"
      query={input.query}
    />
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: SearchResponse | { error: string }
  callId: string
}) {
  void callId
  if ("error" in output) {
    return <ToolError toolName="Brave Search" error={output.error} />
  }

  if (!output.data || !output.data.grounding) {
    return <ToolError toolName="Brave Search" error="No search results found" />
  }

  const sources = Object.entries(output.data.sources || {})

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-full rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <SearchCheck className="mr-2 size-6 min-w-6" />
        <span className="font-semibold">Searched for: {output.query}</span>
      </p>
      {sources.length > 0 && (
        <Collapsible className="mt-1">
          <CollapsibleTrigger className="group/collapsible flex items-center gap-1 font-medium underline-offset-2 hover:underline">
            <span>Sources ({sources.length})</span>
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
              {sources.map(([url, source]) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

export { ToolStart, ToolResult }
