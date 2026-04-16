import { Cat } from "lucide-react"
import { ToolLoading } from "./tool"

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
      toolName="Random Cat"
      searchString="Searching for cats"
      query={input.query}
    />
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: {
    imageUrl: string
    text: string
  }
  callId: string
}) {
  void callId

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-full rounded-md bg-muted/50 px-4 py-1 ring-1 md:w-[47%]">
      <img
        className="my-2 rounded-lg"
        src={output.imageUrl}
        alt={
          output.text ? `cat image with the text ${output.text}` : "cat Image"
        }
      />
      <p className="text-md flex">
        <Cat className="mr-2" />
        Made A cat image for you!
      </p>
    </div>
  )
}

export { ToolStart, ToolResult }
