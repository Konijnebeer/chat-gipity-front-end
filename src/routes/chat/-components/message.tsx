import { cva } from "class-variance-authority"
import { cn } from "#/lib/utils"

import type { MessageResponse } from "@chat-gipity/schemas"
import { micromark } from "micromark"
import { IconComponent } from "#/components/icon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip"
import { ArrowDownLeft, ArrowUpRight, Bot, Sigma, User } from "lucide-react"
import { Badge } from "#/components/ui/badge"

const messageVariants = cva(
  "prose max-w-[70%] rounded-3xl px-4 py-2 text-sm leading-relaxed dark:prose-invert prose-headings:my-1 prose-p:my-1 prose-pre:bg-muted prose-ol:my-0.5 prose-ul:my-0.5 prose-li:my-0.5 [&_blockquote]:border-s-muted [&_ol>li::marker]:font-bold [&_ol>li::marker]:text-primary [&_ul>li::marker]:text-secondary",
  {
    variants: {
      role: {
        user: "ml-auto rounded-br-md bg-foreground text-background prose-p:text-background prose-headings:text-background",
        assistant: "mr-auto rounded-bl-md bg-accent text-accent-foreground",
        system: "mx-auto rounded-full bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      role: "user",
    },
  }
)

type MessageProps = {
  className?: string
} & { message: MessageResponse }

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

function Message({ message, className }: MessageProps) {
  const content = highlightMentions(
    micromark(message.content, { allowDangerousHtml: true })
  )

  return (
    <div className="flex w-full">
      {message.role !== "user" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-auto mr-2 h-fit rounded-full bg-muted p-1.5">
              {message.sender ? (
                <IconComponent
                  className="h-5 w-5"
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
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {message.inputTokens !== undefined &&
          message.outputTokens !== undefined && (
            <div className="mt-2 flex gap-1">
              <Badge className="bg-muted text-xs text-foreground">
                <ArrowDownLeft className="h-3 w-3" />
                {message.inputTokens}
              </Badge>
              <Badge className="bg-muted text-xs text-foreground">
                <ArrowUpRight className="h-3 w-3" />
                {message.outputTokens}
              </Badge>
              {message.totalTokens !== undefined && (
                <Badge className="bg-muted text-xs text-foreground">
                  <Sigma className="h-3 w-3" />
                  {message.totalTokens}
                </Badge>
              )}
            </div>
          )}
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

export { Message }
