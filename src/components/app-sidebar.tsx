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
import { useAgentsQuery } from "#/hooks/agents.query"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, type LucideIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { ChatResponse } from "@chat-gipity/schemas"


// This is sample data.
const data = {
  user: {
    name: "konijnebeer",
    email: "noah@konijnebeer.com",
    avatar: "/avatars/konijnebeer.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: (
        <TerminalSquareIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: (
        <BotIcon
        />
      ),
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: (
        <BookOpenIcon
        />
      ),
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // fetch all data for the sidebar in a single request and pass it down to the components
  // for now only fetches chat history uses tanstack query

  const sidebarChatQuery = useQuery<ChatResponse[]>({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const response = await fetch(`/api/chat`)
      if (!response.ok) {
        throw new Error(`Failed to fetch chat history with status ${response.status}`)
      }

      const data: ChatResponse[] = await response.json()
      if (!Array.isArray(data)) {
        return []
      }

      return data
    },
  })

  const sidebarAgentsQuery = useAgentsQuery()

  const agents = sidebarAgentsQuery.data || []

  // delete chat function to pass down to NavChats
  const handleDeleteChat = async (id: string) => {
    try {
      const response = await fetch(`/api/chat/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete chat with status ${response.status}`)
      }

      // Invalidate the chat history query to refetch the updated list of chats
      sidebarChatQuery.refetch()
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }
  
  if (sidebarChatQuery.isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          {/* <TeamSwitcher teams={data.teams} /> */}
        </SidebarHeader>
        <SidebarContent>
          <NavMain agents={agents}/>
          {/* <NavMainOld items={data.navMain} /> */}

          <NavChats chats={sidebarChatQuery.data || []} handleDeleteChat={handleDeleteChat}/>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain agents={agents} />
        {/* <NavMainOld items={data.navMain} /> */}

        <NavChats chats={sidebarChatQuery.data || []} handleDeleteChat={handleDeleteChat} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
