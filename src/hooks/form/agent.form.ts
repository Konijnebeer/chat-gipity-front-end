import { fieldContext, formContext } from "../context"
import { createFormHook } from "@tanstack/react-form"
import { InputField, TextAreaField } from "@/components/form/shared"
import { IconPickerField } from "@/components/form/icon-picker-field"
import { MultiPickerField } from "#/components/form/multi-picker"

export const { useAppForm: useAgentForm, withForm: withAgentForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      InputField,
      TextAreaField,
      IconPickerField,
      MultiPickerField,
    },
    formComponents: {},
  })
