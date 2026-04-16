"use client"

import * as React from "react"

import { NavMain } from "#/components/nav-main"
// import { NavMainOld } from "#/components/nav-main.old"
import { NavChats } from "#/components/nav-chats"
import { NavUser } from "#/components/nav-user"
// import { TeamSwitcher } from "#/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "#/components/ui/sidebar"
import { useAgentsQuery } from "#/hooks/query/agents.query"
import { useQuery } from "@tanstack/react-query"
import type { ChatResponse } from "@chat-gipity/schemas"
import { fetchWithAuth } from "#/lib/api"
import { getAccessToken } from "#/lib/tokens"
import { useChatsQuery } from "#/hooks/query/chats.query"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // fetch all data for the sidebar in a single request and pass it down to the components
  // for now only fetches chat history uses tanstack query
  const isLoggedIn = Boolean(getAccessToken())

  const userQuery = useQuery({
    queryKey: ["user"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const response = await fetchWithAuth("/api/user/me")
      if (!response.ok) {
        throw new Error(
          `Failed to fetch user data with status ${response.status}`
        )
      }
      return response.json()
    },
  })

  const sidebarChatQuery = useChatsQuery()
  const sidebarAgentsQuery = useAgentsQuery()
  const agents = sidebarAgentsQuery.data || []
  const chats = sidebarChatQuery.data || []
  const user = userQuery.data || null

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      {isLoggedIn && (
        <>
          <SidebarContent>
            {/* @ts-ignore */}
            <NavMain agents={agents} />
            <NavChats chats={chats} />
          </SidebarContent>
          <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </>
      )}
      <SidebarRail />
    </Sidebar>
  )
}
