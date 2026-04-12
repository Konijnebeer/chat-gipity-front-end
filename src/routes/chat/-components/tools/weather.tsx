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

function ToolStart({ input, callId }: { input: WeatherQuery; callId: string }) {
  void callId
  return (
    <div>
      <p>
        <Spinner className="mr-2" />
        <span>Searching for weather information in </span>
        <span>{input.city}</span>
      </p>
    </div>
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: WeatherResponse
  callId: string
}) {
  void callId
  return (
    <div className="bg-muted/50 py-1 px-4 w-fit rounded-md ring-1 my-2 mr-2 inline-block">
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
