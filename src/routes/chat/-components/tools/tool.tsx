import type {
  DictionaryQuery,
  DictionaryResponse,
  SearchResponse,
  WeatherQuery,
  WeatherResponse,
} from "@chat-gipity/schemas"
import { TriangleAlert } from "lucide-react"
import { Spinner } from "#/components/ui/spinner"

import { ToolStart as SearchStart, ToolResult as SearchResult } from "./search"
import {
  ToolStart as DateToolStart,
  ToolResult as DateToolResult,
} from "./date"
import {
  ToolStart as WeatherStart,
  ToolResult as WeatherResult,
} from "./weather"
import { ToolStart as CatStart, ToolResult as CatResult } from "./random-cat"
import {
  ToolStart as QuestionnaireStart,
  ToolResult as QuestionnaireResult,
} from "./questionnaire"
import { ToolStart as ApodStart, ToolResult as ApodResult } from "./apod"
import type { ApodQuery, ApodResponse } from "@chat-gipity/schemas"
import {
  ToolStart as DictionaryStart,
  ToolResult as DictionaryResult,
} from "./dictionary"
import { ToolStart as SkillStart, ToolResult as SkillResult } from "./skill"
import { CreateAgentStart, CreateAgentResult } from "./agent"

export type ToolStart = {
  toolName: string
  input: unknown
  callId: string
}
export type ToolResult = {
  toolName: string
  output: unknown
  callId: string
}

// tries to find specific tool component to render based on the tool name, if no specific component is found, it renders a default component
function ToolStart({ toolName, input, callId }: ToolStart) {
  switch (toolName) {
    case "get_current_date_time":
      return <DateToolStart input={input} callId={callId} />
    case "search":
      return <SearchStart input={input as { query: string }} callId={callId} />
    case "get_weather":
      return <WeatherStart input={input as WeatherQuery} callId={callId} />
    case "get_random_cat_with_description":
      return <CatStart input={input as { query: string }} callId={callId} />
    case "get_questionnaire":
      return <QuestionnaireStart input={input} callId={callId} />
    case "get_apod":
      return <ApodStart input={input as ApodQuery} callId={callId} />
    case "get_definition":
      return (
        <DictionaryStart input={input as DictionaryQuery} callId={callId} />
      )
    case "create_agent":
      return (
        <CreateAgentStart input={input as { name: string }} callId={callId} />
      )
    case "get_skill_info":
      return <SkillStart input={input as { name: string }} callId={callId} />
    default: {
      console.log(`${toolName} input:`, input)
      return (
        <div>
          <p>Tool Start: {toolName}</p>
        </div>
      )
    }
  }
}

// tries to find specific tool component to render based on the tool name, if no specific component is found, it renders a default component
function ToolResult({ toolName, output, callId }: ToolResult) {
  switch (toolName) {
    case "search":
      return <SearchResult output={output as SearchResponse} callId={callId} />
    case "get_current_date_time":
      return (
        <DateToolResult
          output={output as { date: string; time: string }}
          callId={callId}
        />
      )
    case "get_weather":
      return (
        <WeatherResult output={output as WeatherResponse} callId={callId} />
      )
    case "get_random_cat_with_description":
      return (
        <CatResult
          output={output as { imageUrl: string; text: string }}
          callId={callId}
        />
      )
    case "get_questionnaire":
      return <QuestionnaireResult output={output} callId={callId} />
    case "get_apod":
      return <ApodResult output={output as ApodResponse} callId={callId} />
    case "get_definition":
      return (
        <DictionaryResult
          output={output as DictionaryResponse}
          callId={callId}
        />
      )
    case "create_agent":
      return (
        <CreateAgentResult
          output={output as { name: string }}
          callId={callId}
        />
      )
    case "get_skill_info":
      return (
        <SkillResult
          output={output as { name: string; content: string }}
          callId={callId}
        />
      )

    default: {
      console.log(`${toolName} result:`, output)
      return (
        <div>
          <p>Tool Result: {toolName}</p>
        </div>
      )
    }
  }
}

function ToolLoading({
  searchString,
  toolName,
  query,
}: {
  searchString: string
  toolName: string
  query?: string
}) {
  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-md flex">
        <Spinner className="mr-2" />
        <span>{toolName}</span>
      </p>
      <p className="text-sm text-muted-foreground">
        {searchString} {query}…
      </p>
    </div>
  )
}

function ToolError({ toolName, error }: { toolName: string; error: string }) {
  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-destructive/50 px-4 py-1 ring-1 ring-destructive">
      <p className="text-md flex">
        <TriangleAlert className="mr-2" />
        <span className="font-semibold">
          Error in {toolName}: {error}
        </span>
      </p>
    </div>
  )
}

export { ToolStart, ToolResult, ToolLoading, ToolError }
