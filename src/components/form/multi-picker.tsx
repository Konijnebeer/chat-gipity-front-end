import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/components/ui/combobox"
import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { XIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { useFieldContext } from "#/hooks/context"
import type { SkillResponse, ToolResponse } from "@chat-gipity/schemas"
import { IconComponent } from "../icon"

interface ComboboxFieldProps {
  items: ToolResponse[] | SkillResponse[];
  fallBackIcon?: React.ReactNode;
  label: string;
  placeholder?: string;
  empty?: string;
}

function MultiPickerField({
  items,
  fallBackIcon,
  label,
  placeholder,
  empty,
}: ComboboxFieldProps) {
  const field = useFieldContext<string[] | undefined>()
  const [comboboxValue, setComboboxValue] = useState("")
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const selectedItemsIds = field.state.value ?? []

  // Turn data into { value, label }[] for the Combobox.
  const options = items
    .filter((item) => !selectedItemsIds.includes(item.id))
    .map((item) => ({
      id: item.id,
      value: item.name,
      label: item.name,
    }))

  const selectedItems = useMemo(
    () => items.filter((item) => selectedItemsIds.includes(item.id)),
    [items, selectedItemsIds]
  )

  const addItem = (itemName?: string) => {
    if (!itemName) {
      return
    }

    const itemId = items.find((item) => item.name === itemName)?.id
    if (!itemId) {
      return
    }

    if (selectedItemsIds.includes(itemId)) {
      setComboboxValue("")
      return
    }

    field.handleChange([...selectedItemsIds, itemId])
    setComboboxValue("")
  }

  const removeItem = (itemId: string) => {
    field.handleChange(selectedItemsIds.filter((id) => id !== itemId))
  }

  return (
    <div className="w-full">
      <div>
        <Field data-invalid={isInvalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Combobox
            items={options}
            value={comboboxValue}
            onValueChange={(value) => addItem(value ?? undefined)}
          >
            <ComboboxInput placeholder={placeholder} />
            <ComboboxContent>
              <ComboboxEmpty>{empty}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.id} value={item.value}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedItems.length === 0 && (
          <p className="pl-1 text-sm text-muted-foreground">
            No items selected.
          </p>
        )}

        {selectedItems.map((item) => (
          <Badge key={item.id} variant="outline" className="h-8 gap-1 pr-1">
            <IconComponent
              iconName={item.icon || ""}
              fallBackIcon={fallBackIcon}
            />
            <span>{item.name}</span>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              className="size-5"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              <XIcon />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}

export { MultiPickerField }