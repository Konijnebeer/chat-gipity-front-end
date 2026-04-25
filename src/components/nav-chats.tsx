"use client"

import { useState } from "react"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog"
import { Button } from "#/components/ui/button"
import { FieldGroup } from "#/components/ui/field"
import { Spinner } from "#/components/ui/spinner"
import { Toggle } from "#/components/ui/toggle"
import { useChatForm } from "#/hooks/form/chat.form"
import { cn } from "#/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { ChatSchema, type ChatResponse } from "@chat-gipity/schemas"
import {
  MoreHorizontalIcon,
  Trash2Icon,
  TerminalSquareIcon,
  Pencil,
  Star,
} from "lucide-react"
import { toast } from "sonner"
import { IconComponent } from "./icon"

const chatUpdateSchema = ChatSchema.pick({
  name: true,
  icon: true,
})

export function NavChats({ chats }: { chats: ChatResponse[] }) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { id: currentChatId } = useParams({
    strict: false, // allows this component to render outside /chat/$id
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/chat/${id}/favorite`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error(`Favorite update failed with status ${response.status}`)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update favorite status"
      toast.error(message)
      console.error("Favorite update failed:", error)
    },
  })

  const updateChatMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      icon,
    }: {
      id: string
      name: string
      icon: string
    }) => {
      const response = await fetch(`/api/chat/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, icon }),
      })

      if (!response.ok) {
        throw new Error(`Chat update failed with status ${response.status}`)
      }
    },
    onSuccess: () => {
      toast.success("Chat updated")
      void queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to update chat"
      toast.error(message)
      console.error("Chat update failed:", error)
    },
  })

  const deleteChatMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/chat/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Delete chat failed with status ${response.status}`)
      }
    },
    onSuccess: (_, id) => {
      toast.success("Chat deleted")
      void queryClient.invalidateQueries({ queryKey: ["chats"] })

      if (id === currentChatId) {
        navigate({ to: "/" })
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete chat"
      toast.error(message)
      console.error("Delete chat failed:", error)
    },
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel asChild>
        <Link to="/chat" className="underline-offset-2 hover:underline">
          Chats
        </Link>
      </SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              tooltip={item.name}
              className={
                item.id === currentChatId
                  ? "bg-foreground text-primary-foreground hover:bg-foreground hover:text-primary-foreground"
                  : undefined
              }
            >
              <Link to="/chat/$id" params={{ id: item.id }}>
                <IconComponent
                  iconName={item.icon}
                  fallBackIcon={<TerminalSquareIcon />}
                />
                <span>{item.name ?? "Untitled chat"}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className={
                    item.id === currentChatId
                      ? "text-primary-foreground hover:bg-foreground hover:text-primary-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
                      : undefined
                  }
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <EditChatDialog
                  chat={item}
                  isPending={updateChatMutation.isPending}
                  onSubmit={async (values) => {
                    await updateChatMutation.mutateAsync({
                      id: item.id,
                      name: values.name,
                      icon: values.icon,
                    })
                  }}
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="text-muted-foreground" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </EditChatDialog>
                <DropdownMenuItem
                  asChild
                  onSelect={(e) => {
                    e.preventDefault()
                    toggleFavoriteMutation.mutate(item.id)
                  }}
                  disabled={toggleFavoriteMutation.isPending}
                >
                  <Toggle
                    pressed={item.favorite}
                    aria-label={
                      item.favorite ? "Unfavorite chat" : "Favorite chat"
                    }
                    className="h-auto w-full justify-start rounded-xl px-3 py-2 text-sm font-normal data-[state=on]:bg-accent"
                  >
                    <Star
                      className={cn(
                        "text-muted-foreground",
                        item.favorite && "fill-yellow-400 text-yellow-400"
                      )}
                    />
                    <span>{item.favorite ? "Unfavorite" : "Favorite"}</span>
                  </Toggle>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteChatDialog
                  chatName={item.name ?? "Untitled chat"}
                  isPending={deleteChatMutation.isPending}
                  onDelete={async () => {
                    await deleteChatMutation.mutateAsync(item.id)
                  }}
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2Icon className="text-muted-foreground" />
                    <span>Delete Chat</span>
                  </DropdownMenuItem>
                </DeleteChatDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function EditChatDialog({
  chat,
  onSubmit,
  isPending,
  children,
}: {
  chat: ChatResponse
  onSubmit: (values: { name: string; icon: string }) => Promise<void>
  isPending: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <EditChatDialogContent
            key={chat.id}
            chat={chat}
            isPending={isPending}
            onCancel={() => setOpen(false)}
            onSubmit={async (values) => {
              await onSubmit(values)
              setOpen(false)
            }}
          />
        )}
      </Dialog>
    </>
  )
}

function EditChatDialogContent({
  chat,
  onSubmit,
  onCancel,
  isPending,
}: {
  chat: ChatResponse
  onSubmit: (values: { name: string; icon: string }) => Promise<void>
  onCancel: () => void
  isPending: boolean
}) {
  const editForm = useChatForm({
    defaultValues: {
      name: chat.name ?? "",
      icon: chat.icon ?? "",
    },
    validators: {
      onSubmitAsync: chatUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name,
        icon: value.icon ?? "",
      })
    },
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Chat</DialogTitle>
        <DialogDescription>Update the chat name and icon.</DialogDescription>
      </DialogHeader>
      <form
        id={`edit-chat-form-${chat.id}`}
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void editForm.handleSubmit()
        }}
      >
        <FieldGroup>
          <editForm.AppField
            name="name"
            children={(field) => (
              <field.InputField label="Name" placeholder="Untitled chat" />
            )}
          />
          <editForm.AppField
            name="icon"
            children={(field) => <field.IconPickerField label="Icon" />}
          />
        </FieldGroup>
      </form>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          form={`edit-chat-form-${chat.id}`}
          disabled={isPending || editForm.state.isSubmitting}
        >
          {(isPending || editForm.state.isSubmitting) && <Spinner />}
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function DeleteChatDialog({
  chatName,
  onDelete,
  isPending,
  children,
}: {
  chatName: string
  onDelete: () => Promise<void>
  isPending: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {chatName}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={async () => {
                await onDelete()
                setOpen(false)
              }}
            >
              {isPending && <Spinner />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
