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

const messageVariants = cva(
  "prose max-w-[70%] rounded-3xl px-4 py-2 text-sm leading-relaxed prose-headings:my-1 prose-p:my-1 prose-ol:my-0.5 prose-ul:my-0.5 prose-li:my-0.5",
  {
    variants: {
      role: {
        user: "ml-auto rounded-br-md bg-primary text-primary-foreground",
        assistant: "mr-auto rounded-bl-md bg-muted text-foreground",
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
  const content = highlightMentions(micromark(message.content))

  return (
    <div className="flex w-full">
      {message.sender && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-auto mr-2 h-fit rounded-full bg-muted p-1.5">
              <IconComponent
                iconName={message.sender.icon || ""}
                color={message.sender.color}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {message.sender.name || "Unknown"}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
      <div
        className={cn(messageVariants({ role: message.role }), className)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export { Message }
