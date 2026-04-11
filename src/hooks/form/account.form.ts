import { fieldContext, formContext } from "../context"
import { createFormHook } from "@tanstack/react-form"
import { InputField } from "@/components/form/shared"
import { IconPickerField } from "#/components/form/icon-picker-field"

export const { useAppForm: useAccountForm, withForm: withAccountForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      InputField,
      IconPickerField,
    },
    formComponents: {},
  })
