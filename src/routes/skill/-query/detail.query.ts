import type { SkillResponse } from "@chat-gipity/schemas"
import { queryOptions, useQuery } from "@tanstack/react-query"

async function fetchSkillDetails(id: string): Promise<SkillResponse> {
  const response = await fetch(`/api/skill/${id}`)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch skill details with status ${response.status}`
    )
  }

  const data = (await response.json()) as SkillResponse
  return data
}

export const skillDetailsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["skill", id],
    queryFn: () => fetchSkillDetails(id),
    staleTime: 60_000,
  })

export function useSkillDetails(id: string) {
  return useQuery(skillDetailsQueryOptions(id))
}
