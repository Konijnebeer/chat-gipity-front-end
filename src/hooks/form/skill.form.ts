import { fieldContext, formContext } from "../context"
import { createFormHook } from "@tanstack/react-form"
import { InputField, TextAreaField } from "@/components/form/shared"
import { IconPickerField } from "@/components/form/icon-picker-field"

export const { useAppForm: useSkillForm, withForm: withSkillForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      InputField,
      TextAreaField,
      IconPickerField,
    },
    formComponents: {},
  })
