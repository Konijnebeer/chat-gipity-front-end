import { useCallback, useEffect, useRef, useState } from "react"
import { useFieldContext } from "@/hooks/context"
import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
} from "#/components/ui/input-group"
import { Spinner } from "#/components/ui/spinner"
import {
  ArrowBigRight,
  AtSign,
  Hash,
  Plus,
  ScrollText,
  Slash,
  Wrench,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  // DropdownMenuShortcut, TODO: add shortcut support
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { IconComponent } from "../icon"
import { useAgentsQuery } from "#/hooks/query/agents.query"
import { useToolsQuery } from "#/hooks/query/tools.query"
import { useSkillsQuery } from "#/hooks/query/skills.query"

type PromptInputField = {
  label?: string
  placeholder: string
  maxLength?: number
  isPending: boolean
  onStop?: () => void
}

const MAX_ROWS = 15

function PromptInputField({
  label,
  placeholder,
  maxLength,
  isPending,
  onStop,
}: PromptInputField) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [rows, setRows] = useState(1)

  // Data for the dropdown
  const agentsQuery = useAgentsQuery()
  const agents = agentsQuery.data ?? []
  const toolsQuery = useToolsQuery()
  const tools = toolsQuery.data ?? []
  const skillsQuery = useSkillsQuery()
  const skills = skillsQuery.data ?? []

  const recalculateRows = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.rows = 1

    let next = 1
    while (next < MAX_ROWS && textarea.scrollHeight > textarea.clientHeight) {
      textarea.rows = ++next
    }
    setRows(textareaRef.current?.rows ?? 1)
  }, [])

  useEffect(() => {
    recalculateRows()
  }, [field.state.value, recalculateRows])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const observer = new ResizeObserver(() => recalculateRows())
    observer.observe(textarea)
    return () => observer.disconnect()
  }, [recalculateRows])

  const Dropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton variant="outline" size="icon-sm" disabled={isPending}>
          <Plus />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // align="center"
        className="max-h-60 min-w-40"
      >
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <AtSign className="mr-2 h-4 w-4" />
              <span>Agents</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              alignOffset={-40}
              sideOffset={8}
              className="max-h-48 min-w-40 overflow-y-auto"
            >
              {agents.map((agent) => (
                <DropdownMenuItem
                  key={agent.id}
                  onSelect={() => {
                    field.setValue(`${field.state.value} @${agent.name} `)
                  }}
                >
                  <IconComponent
                    iconName={agent.icon || ""}
                    color={agent.color}
                  />
                  <span>{agent.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Skills */}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Hash className="mr-2 h-4 w-4" />
              <span>Skills</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              alignOffset={-20}
              sideOffset={8}
              className="max-h-48 min-w-40 overflow-y-auto"
            >
              {skills.map((skill) => (
                <DropdownMenuItem
                  key={skill.id}
                  onSelect={() => {
                    field.setValue(`${field.state.value} #${skill.name} `)
                  }}
                >
                  <IconComponent
                    iconName={skill.icon || ""}
                    fallBackIcon={<Wrench />}
                  />
                  <span>{skill.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Tools */}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Slash className="mr-2 h-4 w-4" />
              <span>Tools</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              alignOffset={-80}
              sideOffset={8}
              className="max-h-48 min-w-40 overflow-y-auto"
            >
              {tools.map((tool) => (
                <DropdownMenuItem
                  key={tool.id}
                  onSelect={() => {
                    field.setValue(`${field.state.value} /${tool.slug} `)
                  }}
                >
                  <IconComponent
                    iconName={tool.icon || ""}
                    fallBackIcon={<ScrollText />}
                  />
                  <span>{tool.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <Field>
      {label && (
        <div className="flex w-full justify-center py-4">
          <FieldLabel htmlFor={field.name} className="text-xl">
            {label}
          </FieldLabel>
        </div>
      )}
      <InputGroup className="bg-muted has-[textarea]:rounded-2xl!">
        <InputGroupTextarea
          ref={textareaRef}
          id={field.name}
          name={field.name}
          placeholder={placeholder}
          aria-label={label ?? "Send message"}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.form?.requestSubmit()
            }
          }}
          disabled={isPending}
          aria-invalid={isInvalid}
          maxLength={maxLength}
          rows={rows}
          className="min-h-9 overflow-y-auto leading-5"
        />
        {rows === 1 && (
          <InputGroupAddon align="inline-start">{Dropdown}</InputGroupAddon>
        )}
        <InputGroupAddon align={rows > 1 ? "block-end" : "inline-end"}>
          {rows > 1 && Dropdown}
          {maxLength && (
            <InputGroupText>
              {`${field.state.value.length}/${maxLength}`}
            </InputGroupText>
          )}
          <InputGroupButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="group ml-auto"
            onClick={(e) => {
              if (isPending) {
                e.preventDefault()
                e.stopPropagation()
                onStop?.()
                return
              }
              e.currentTarget.form?.requestSubmit()
            }}
          >
            {isPending ? (
              <>
                <Spinner className="group-hover:opacity-0" />
                <X className="absolute opacity-0 transition-opacity group-hover:opacity-100" />
              </>
            ) : (
              <ArrowBigRight />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export { PromptInputField }
