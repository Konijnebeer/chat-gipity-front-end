import { Spinner } from "#/components/ui/spinner"
import type { WeatherQuery, WeatherResponse } from "@chat-gipity/schemas"
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Cloudy,
  Sun,
  Tornado,
} from "lucide-react"
import { ToolError, ToolLoading } from "./tool"

function ToolStart({ input, callId }: { input: WeatherQuery; callId: string }) {
  void callId
  return (
    <ToolLoading
      searchString="Searching for weather information in"
      toolName="Weather Lookup"
      query={input.city}
    />
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: WeatherResponse | { error: string }
  callId: string
}) {
  void callId

  if ("error" in output) {
    return <ToolError toolName="Weather Lookup" error={output.error} />
  }

  return (
    <div className="mt-2 mr-2 mb-2 inline-block w-fit rounded-md bg-muted/50 px-4 py-1 ring-1">
      <p className="text-lg">{output.city}</p>
      <p className="flex items-center gap-2">
        <span>
          {output.condition === "Sunny" && <Sun className="size-5" />}
          {output.condition === "Clear" && <CloudSun className="size-5" />}
          {output.condition === "Partly Cloudy" && <Cloud className="size-5" />}
          {output.condition === "Cloudy" && <Cloudy className="size-5" />}
          {output.condition === "Drizzle" && (
            <CloudDrizzle className="size-5" />
          )}
          {output.condition === "Foggy" && <CloudFog className="size-5" />}
          {output.condition === "Hail" && <CloudHail className="size-5" />}
          {output.condition === "Rainy" && <CloudRain className="size-5" />}
          {output.condition === "Heavy Rain" && (
            <CloudRainWind className="size-5" />
          )}
          {output.condition === "Snowy" && <CloudSnow className="size-5" />}
          {output.condition === "Stormy" && (
            <CloudLightning className="size-5" />
          )}
          {output.condition === "Tornado" && <Tornado className="size-5" />}
        </span>
        <span>{output.temperature}°C</span>
        <span>{output.condition}</span>
      </p>
    </div>
  )
}

export { ToolStart, ToolResult }
