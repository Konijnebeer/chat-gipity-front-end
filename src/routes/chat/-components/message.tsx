import { cva } from "class-variance-authority"
import { cn } from "#/lib/utils"

import { IconComponent } from "#/components/icon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip"
import { Badge } from "#/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, Bot, Sigma, User } from "lucide-react"
import type { MessageResponse } from "@chat-gipity/schemas"
import type { StreamingBlock } from "../$id"
import { ToolResult, ToolStart } from "./tools/tool"
import { micromark } from "micromark"
import { gfm, gfmHtml } from "micromark-extension-gfm"

const messageVariants = cva(
  "prose-custom max-w-[70%] rounded-3xl px-4 py-2 text-sm leading-relaxed",
  {
    variants: {
      role: {
        user: "ml-auto rounded-br-md bg-foreground text-background prose-headings:text-background prose-p:text-background",
        assistant: "mr-auto rounded-bl-md bg-accent text-accent-foreground",
        system: "mx-auto rounded-full bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      role: "user",
    },
  }
)

function highlightMentions(html: string): string {
  const mentionPattern = /(^|[\s(>])@([a-zA-Z0-9_-]+)/g

  return html
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (part.startsWith("<")) {
        return part
      }

      return part.replace(
        mentionPattern,
        '$1<span class="mention-highlight">@$2</span>'
      )
    })
    .join("")
}

function StreamingMessage({ blocks }: { blocks: StreamingBlock[] }) {
  return (
    <div className="flex w-full">
      <div className="mt-auto mr-2 h-fit rounded-full bg-muted p-1.5">
        <Bot className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className={messageVariants({ role: "assistant" })}>
        <Blocks blocks={blocks} />
      </div>
    </div>
  )
}

function Blocks({ blocks }: { blocks: StreamingBlock[] }) {
  const completedToolCallIds = new Set(
    blocks
      .filter((block) => block.type === "tool_result")
      .map((block) => block.callId)
  )

  return blocks.map((block, i) => {
    switch (block.type) {
      case "token":
        return (
          <div
            key={i}
            dangerouslySetInnerHTML={{
              __html: highlightMentions(
                micromark(block.content, {
                  allowDangerousHtml: true,
                  extensions: [gfm()],
                  htmlExtensions: [gfmHtml()],
                })
              ),
            }}
          />
        )
      case "text":
        return (
          <div
            key={i}
            dangerouslySetInnerHTML={{
              __html: highlightMentions(
                micromark(block.content, {
                  allowDangerousHtml: true,
                  extensions: [gfm()],
                  htmlExtensions: [gfmHtml()],
                })
              ),
            }}
          />
        )
      case "tool_start":
        if (completedToolCallIds.has(block.callId)) {
          return null
        }

        return (
          <ToolStart
            key={i}
            toolName={block.toolName}
            input={block.input}
            callId={block.callId}
          />
        )
      case "tool_result":
        return (
          <ToolResult
            key={i}
            toolName={block.toolName}
            output={block.output}
            callId={block.callId}
          />
        )
      default:
        return null
    }
  })
}

type MessageProps = {
  className?: string
} & { message: MessageResponse }

function Message({ message, className }: MessageProps) {
  return (
    <div className="flex w-full">
      {message.role !== "user" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-auto mr-2 h-fit rounded-full bg-muted p-1.5">
              {message.sender ? (
                <IconComponent
                  fallBackIcon={<Bot className="size-5" />}
                  className="size-5"
                  iconName={message.sender.icon || ""}
                  color={message.sender.color}
                />
              ) : (
                <Bot className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </TooltipTrigger>
          {message.sender && (
            <TooltipContent>
              <p className="text-sm font-medium">
                {message.sender.name || "Unknown"}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      )}

      <div className={cn(messageVariants({ role: message.role }), className)}>
        {message.blocks && message.blocks.length > 0 ? (
          <Blocks blocks={message.blocks as StreamingBlock[]} />
        ) : (
          // Fallback for user messages or messages without blocks
          <div
            dangerouslySetInnerHTML={{
              __html: highlightMentions(
                micromark(message.content, {
                  allowDangerousHtml: true,
                  extensions: [gfm()],
                  htmlExtensions: [gfmHtml()],
                })
              ),
            }}
          />
        )}
        {message.sender ||
        message.inputTokens !== undefined ||
        message.outputTokens !== undefined ? (
          <div className="mt-2 flex gap-1">
            {message.sender && (
              <Badge variant="outline" className="font-bold">
                {message.sender.name}
              </Badge>
            )}
            {message.inputTokens !== undefined && (
              <Badge className="bg-muted text-xs text-foreground">
                <ArrowDownLeft className="h-3 w-3" />
                {message.inputTokens}
              </Badge>
            )}
            {message.outputTokens !== undefined && (
              <Badge className="bg-muted text-xs text-foreground">
                <ArrowUpRight className="h-3 w-3" />
                {message.outputTokens}
              </Badge>
            )}
            {message.totalTokens !== undefined && (
              <Badge className="bg-muted text-xs text-foreground">
                <Sigma className="h-3 w-3" />
                {message.totalTokens}
              </Badge>
            )}
          </div>
        ) : null}
      </div>

      {message.role === "user" && (
        <div className="mt-auto ml-2 h-fit rounded-full bg-primary p-1.5">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}

function AgentInfoCard() {
  // Implementation for the agent info card
  // icon and name
  // shows the amount of messages they have send
  // amount of tokens they have outputted
}

export { Message, StreamingMessage }
