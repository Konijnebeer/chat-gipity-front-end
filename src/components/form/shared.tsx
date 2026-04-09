import { useFieldContext } from "@/hooks/context";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/components/ui/combobox"
import { IconComponent } from "../icon";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "../ui/input-group";
interface InputFieldProps {
  label: string;
  placeholder?: string;
  autocomplete?: string;
  type?: string;
}

function InputField({
  label,
  placeholder,
  autocomplete = "off",
  type = "text",
}: InputFieldProps) {
  const field = useFieldContext<string | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete={autocomplete}
        type={type}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

interface TextAreaFieldProps {
  label: string;
  placeholder?: string;
  maxCharacters: string;
  rows?: number;
}

function TextAreaField({
  label,
  placeholder,
  maxCharacters,
  rows = 5,
}: TextAreaFieldProps) {
  const field = useFieldContext<string | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id={field.name}
          name={field.name}
          value={field.state.value ?? ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="min-h-12 resize-none"
          aria-invalid={isInvalid}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {(field.state.value ?? "").length}/{maxCharacters} karakters
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

interface ComboboxFieldProps {
  label: string;
  placeholder?: string;
  empty?: string;
  options: { value: string; label: string }[];
}

function ComboboxField({ label, placeholder, empty, options }: ComboboxFieldProps) {
  const field = useFieldContext<string | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Combobox
        items={options}
        value={field.state.value ?? ""}
        onValueChange={(value) => field.handleChange(value ?? "")}
      >
        <ComboboxInput placeholder={placeholder} />
        <ComboboxContent>
            <ComboboxEmpty>{ empty }</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item.value}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

function ComboBoxFieldIcons({ label, placeholder, empty, options }: ComboboxFieldProps) {
 const field = useFieldContext<string | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
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
            <ComboboxEmpty>{ empty }</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item.value}>
                <IconComponent iconName={item.value} />
                <span>
                  {item.label}
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
export { InputField, TextAreaField, ComboboxField, ComboBoxFieldIcons };
