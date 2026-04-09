"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/alert-dialog"
import { Link, useParams } from "@tanstack/react-router"
import type { ChatResponse } from "@chat-gipity/schemas"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { MoreHorizontalIcon, FolderIcon, ArrowRightIcon, Trash2Icon, TerminalSquareIcon } from "lucide-react"
import { IconComponent } from "./icon"

export function NavChats({
  chats,
  handleDeleteChat,
}: {
  chats: ChatResponse[]
  handleDeleteChat: (id: string) => Promise<void>
}) {
  const { isMobile } = useSidebar()

  const { id: currentChatId } = useParams({
    strict: false, // allows this component to render outside /chat/$id
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item) => (
          <SidebarMenuItem
            key={item.id}
          >
            <SidebarMenuButton asChild tooltip={item.name}
            className={item.id === currentChatId ? "bg-foreground text-primary-foreground hover:bg-foreground hover:text-primary-foreground" : undefined}>
              <Link to="/chat/$id" params={{ id: item.id }}>
                <IconComponent iconName={item.icon} fallBackIcon={<TerminalSquareIcon />} />
                <span>{item.name ?? "Untitled chat"}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className={item.id === currentChatId ? "text-primary-foreground hover:bg-foreground hover:text-primary-foreground aria-expanded:bg-muted aria-expanded:text-foreground" : undefined}
                >
                  <MoreHorizontalIcon
                  />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <FolderIcon className="text-muted-foreground" />
                  <span>View Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowRightIcon className="text-muted-foreground" />
                  <span>Share Chat</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2Icon className="text-muted-foreground" />
                    <span>Delete Chat</span>
                  </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                    Are you sure you want to delete this chat? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteChat(item.id)}>
                    Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
