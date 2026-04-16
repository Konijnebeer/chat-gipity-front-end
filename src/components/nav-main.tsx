"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "#/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible"
import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  Bot,
  ChevronDown,
  ChevronRightIcon,
  ChevronUp,
  PackagePlus,
  Pencil,
} from "lucide-react"
import type { Agent } from "@chat-gipity/schemas"
import { IconComponent } from "./icon"

type AgentWithId = Agent & { id: string }

export function NavMain({ agents }: { agents: AgentWithId[] }) {
  const [showAllAgents, setShowAllAgents] = useState(false)
  const hasMoreAgents = agents.length > 5
  const visibleAgents = showAllAgents ? agents : agents.slice(0, 5)

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="New Chat">
              <Link to="/">
                <Pencil />
                New Chat
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Manage Agents</SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="New Agent">
            <Link to="/agent/create">
              <PackagePlus />
              New Agent
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Agents">
                <Bot />
                <span>Agents</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {visibleAgents.map((agent) => (
                  <SidebarMenuSubItem key={agent.id}>
                    <SidebarMenuSubButton asChild>
                      <Link to="/agent/$id" params={{ id: agent.id }}>
                        <IconComponent
                          iconName={agent.icon || ""}
                          color={agent.color}
                          fallBackIcon={<Bot className="size-4" />}
                        />
                        <span>{agent.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
                {hasMoreAgents && (
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <button
                        type="button"
                        onClick={() => setShowAllAgents((prev) => !prev)}
                      >
                        {showAllAgents ? <ChevronUp /> : <ChevronDown />}
                        <span>
                          {showAllAgents
                            ? "Less"
                            : `More (${agents.length - 5})`}
                        </span>
                      </button>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarGroup>
    </>
  )
}
