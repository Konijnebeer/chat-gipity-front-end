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
import { Link } from "@tanstack/react-router"
import { Bot, ChevronRightIcon, PackagePlus, Pencil } from "lucide-react"
import type { Agent } from "@chat-gipity/schemas"
import { IconComponent } from "./icon"

type AgentWithId = Agent & { id: string }

export function NavMain({ agents }: { agents: AgentWithId[] }) {
  return (
    <>
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
        <Collapsible
            asChild
            // defaultOpen={item.isActive}
            className="group/collapsible"
            >
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
                  {agents.map((agent) => (
                    <SidebarMenuSubItem key={agent.id}>
                      <SidebarMenuSubButton asChild>
                        <Link to="/agent/$id" params={{ id: agent.id }}>
                          <IconComponent iconName={agent.icon || ''} color={agent.color} fallBackIcon={<Bot />} />
                          <span>{agent.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>
    </>
  )
}
