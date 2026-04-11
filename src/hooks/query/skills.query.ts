import type { SkillResponse } from "@chat-gipity/schemas"
import { queryOptions, useQuery } from "@tanstack/react-query"

async function fetchSkills(): Promise<SkillResponse[]> {
  const response = await fetch("/api/skill")
  if (!response.ok) {
    throw new Error(`Failed to fetch skills with status ${response.status}`)
  }

  const data = (await response.json()) as SkillResponse[]
  if (!Array.isArray(data)) {
    return []
  }

  return data
}

export const skillsQueryOptions = queryOptions({
  queryKey: ["skills"],
  queryFn: fetchSkills,
  staleTime: 60_000,
})

export function useSkillsQuery() {
  return useQuery(skillsQueryOptions)
}
