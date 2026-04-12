import type { DictionaryQuery, DictionaryResponse, WeatherQuery, WeatherResponse } from "@chat-gipity/schemas"
import {
  ToolStart as WeatherStart,
  ToolResult as WeatherResult,
} from "./weather"
import {
  ToolStart as QuestionnaireStart,
  ToolResult as QuestionnaireResult,
} from "./questionnaire"
import { ToolStart as ApodStart, ToolResult as ApodResult } from "./apod"
import type {
  ApodQuery,
  ApodResponse,
} from "@chat-gipity/schemas"
import {
  ToolStart as DictionaryStart,
  ToolResult as DictionaryResult,
} from "./dictionary"

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
    case "get_weather":
      return <WeatherStart input={input as WeatherQuery} callId={callId} />
    case "get_questionnaire":
      return <QuestionnaireStart input={input} callId={callId} />
    case "get_apod":
      return <ApodStart input={input as ApodQuery} callId={callId} />
    case "get_definition":
      return (
        <DictionaryStart input={input as DictionaryQuery} callId={callId} />
      )
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
    case "get_weather":
      return (
        <WeatherResult output={output as WeatherResponse} callId={callId} />
      )
    case "get_questionnaire":
      return <QuestionnaireResult output={output} callId={callId} />
    case "get_apod":
      return <ApodResult output={output as ApodResponse} callId={callId} />
    case "get_definition":
      return <DictionaryResult output={output as DictionaryResponse} callId={callId} />
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

export { ToolStart, ToolResult }
