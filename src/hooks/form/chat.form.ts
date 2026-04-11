import { createFormHook } from "@tanstack/react-form"

import { fieldContext, formContext } from "../context"
import { InputField } from "@/components/form/shared"
import { IconPickerField } from "@/components/form/icon-picker-field"

export const { useAppForm: useChatForm, withForm: withChatForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      InputField,
      IconPickerField,
    },
    formComponents: {},
  })
