import { fetchWithAuth } from "#/lib/api"
import type { ChatResponse } from "@chat-gipity/schemas"
import { queryOptions, useQuery } from "@tanstack/react-query"

async function fetchChats(): Promise<ChatResponse[]> {
  const response = await fetchWithAuth("/api/chat")
  if (!response.ok) {
    throw new Error(`Failed to fetch chats with status ${response.status}`)
  }

  const data = (await response.json()) as ChatResponse[]
  if (!Array.isArray(data)) {
    return []
  }

  return data
}

export const chatsQueryOptions = queryOptions({
  queryKey: ["chats"],
  queryFn: fetchChats,
  staleTime: 60_000,
})

export function useChatsQuery() {
  return useQuery(chatsQueryOptions)
}
