import type { AgentResponse } from "@chat-gipity/schemas"
import { queryOptions, useQuery } from "@tanstack/react-query"

async function fetchAgents(): Promise<AgentResponse[]> {
  const response = await fetch("/api/agent")
  if (!response.ok) {
    throw new Error(`Failed to fetch agents with status ${response.status}`)
  }

  const data = (await response.json()) as AgentResponse[]
  if (!Array.isArray(data)) {
    return []
  }

  return data
}

export const agentsQueryOptions = queryOptions({
  queryKey: ["agents"],
  queryFn: fetchAgents,
  staleTime: 60_000,
})

export function useAgentsQuery() {
  return useQuery(agentsQueryOptions)
}
