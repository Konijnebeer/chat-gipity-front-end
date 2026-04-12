import type { AgentResponse } from "@chat-gipity/schemas"
import { queryOptions, useQuery } from "@tanstack/react-query"

async function fetchAgentDetails(id: string): Promise<AgentResponse> {
  const response = await fetch(`/api/agent/${id}`)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch agent details with status ${response.status}`
    )
  }

  const data = (await response.json()) as AgentResponse
  return data
}

export const agentDetailsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["agent", id],
    queryFn: () => fetchAgentDetails(id),
    staleTime: 60_000,
  })

export function useAgentDetails(id: string) {
  return useQuery(agentDetailsQueryOptions(id))
}
