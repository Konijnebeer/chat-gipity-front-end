import { useMemo } from "react"
import { iconNames, type IconName } from "lucide-react/dynamic"

import { useFieldContext } from "@/hooks/context"
import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/components/ui/combobox"
import { IconComponent } from "#/components/icon"

const ICON_OPTIONS = iconNames.map((name) => ({
  value: name,
  label: name,
})) as Array<{ value: IconName; label: string }>

type IconPickerFieldProps = {
  label: string
  placeholder?: string
  empty?: string
}

function IconPickerField({
  label,
  placeholder = "Search an icon",
  empty = "No matching icon found",
}: IconPickerFieldProps) {
  const field = useFieldContext<string | undefined>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const selectedIcon = field.state.value

  // Keep the same array reference for Combobox items to avoid repeated work.
  const options = useMemo(() => ICON_OPTIONS, [])
  // Debug options field to reduce reload
  // const options = useMemo(() => {
  //   return [{ value: "circle", label: "circle" }]
  // }, [])

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Combobox
        items={options}
        value={field.state.value ?? ""}
        onValueChange={(value) => field.handleChange(value || undefined)}
      >
        <ComboboxInput placeholder={placeholder} />
        <ComboboxContent>
          <ComboboxEmpty>{empty}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item.value}>
                <span>{item.label}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div className="mt-2 inline-flex min-h-8 items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-muted-foreground">
        <IconComponent iconName={selectedIcon ?? ""} />
        <span>{selectedIcon || "No icon selected"}</span>
      </div>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export { IconPickerField }
