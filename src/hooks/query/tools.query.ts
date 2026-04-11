import type { ToolResponse } from "@chat-gipity/schemas"
import { queryOptions, useQuery } from "@tanstack/react-query"

async function fetchTools(): Promise<ToolResponse[]> {
  const response = await fetch("/api/tool")
  if (!response.ok) {
    throw new Error(`Failed to fetch tools with status ${response.status}`)
  }

  const data = (await response.json()) as ToolResponse[]
  if (!Array.isArray(data)) {
    return []
  }

  return data
}

export const toolsQueryOptions = queryOptions({
  queryKey: ["tools"],
  queryFn: fetchTools,
  staleTime: 60_000,
})

export function useToolsQuery() {
  return useQuery(toolsQueryOptions)
}
