import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldContext } from "@/hooks/context";
import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText, InputGroupButton } from "#/components/ui/input-group"
import { Spinner } from "#/components/ui/spinner";
import { ArrowBigRight, Plus, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { AgentResponse } from "@chat-gipity/schemas";
import { IconComponent } from "../icon";

type PromptInputField = {
  label?: string,
  placeholder: string,
  maxLength?: number,  
  isPending: boolean,
  onStop?: () => void,
  agents: AgentResponse[],
}

const MAX_ROWS = 6;

function PromptInputField({
  label,
  placeholder,
  maxLength,  
  isPending,
  onStop,
  agents,
}: PromptInputField) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(1);

  const recalculateRows = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.rows = 1;

    let next = 1;
    while (next < MAX_ROWS && textarea.scrollHeight > textarea.clientHeight) {
      textarea.rows = ++next;
    }
    setRows(textareaRef.current?.rows ?? 1);
  }, []);

  useEffect(() => {
    recalculateRows();
  }, [field.state.value, recalculateRows]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const observer = new ResizeObserver(() => recalculateRows());
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [recalculateRows]);

  return (
    <Field>
      {label && (
        
        <div className="flex w-full justify-center py-4">
          <FieldLabel htmlFor={field.name} className="text-xl">{label}</FieldLabel>
        </div>
        )
      }
      <InputGroup className="has-[textarea]:rounded-2xl!">
        <InputGroupTextarea
          ref={textareaRef}
          id={field.name}
          name={field.name}
          placeholder={placeholder}
          aria-label={label ?? "Send message"}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) =>
            field.handleChange(e.target.value)
        }
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          disabled={isPending}
          aria-invalid={isInvalid}
          maxLength={maxLength}
          rows={rows}
          className="max-h-40 min-h-9 overflow-y-auto leading-5"
        />
        <InputGroupAddon align={rows > 1 ? "block-start" : "inline-start"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
          <InputGroupButton
            variant="default"
            size="icon-sm"
            disabled={isPending}
            >
            <Plus/>
              </InputGroupButton>
              </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Select agent</DropdownMenuLabel>
                {agents.map((agent) => (
                  <DropdownMenuItem key={agent.id} onSelect={() => {
                    field.setValue(`${field.state.value} @${agent.name} `)
                  }}>
                    <IconComponent iconName={agent.icon || ""} color={agent.color} />
                    <span>{agent.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>  
        </InputGroupAddon>
          <InputGroupAddon align={rows > 1 ? "block-end" : "inline-end"}>
          { maxLength &&
            <InputGroupText className={ rows > 1 ? "mt-auto" : undefined }>
              {`${field.state.value.length}/${maxLength}`}
            </InputGroupText>
          }              
          <InputGroupButton
            type="button"
            variant="default"
            size="icon-sm"
            className="group ml-auto"
            onClick={(e) => {
              if (isPending) {
                e.preventDefault();
                e.stopPropagation();
                onStop?.();
                return;
              }

              e.currentTarget.form?.requestSubmit();
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
  );
}

export { PromptInputField };