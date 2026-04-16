import { ScrollText } from "lucide-react"
import { ToolError, ToolLoading } from "./tool"
import { useQueryClient } from "@tanstack/react-query"

function CreateAgentStart({
  input,
  callId,
}: {
  input: unknown
  callId: string
}) {
  void callId
  void input

  const funnyLoadingMessages = [
    "Woobeling agent",
    "Summoning the digital overlords",
    "Teaching AI to behave itself",
    "Brewing some artificial intelligence",
    "Convincing electrons to cooperate",
    "Assembling your obedient robot",
  ]

  return (
    <ToolLoading
      searchString={
        funnyLoadingMessages[
          Math.floor(Math.random() * funnyLoadingMessages.length)
        ]
      }
      toolName="Create Agent"
    />
  )
}

function CreateAgentResult({
  output,
  callId,
}: {
  output: { name: string } | { error: string }
  callId: string
}) {
  void callId
  if ("error" in output) {
    return <ToolError toolName="Create Agent" error={output.error} />
  }
  // Invalidate the agents query
  const queryClient = useQueryClient()
  queryClient.invalidateQueries({ queryKey: ["agents"] })

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <ScrollText className="mr-2" />
        <span className="font-semibold">Created: {output.name}</span>
      </p>
    </div>
  )
}

export { CreateAgentStart, CreateAgentResult }
