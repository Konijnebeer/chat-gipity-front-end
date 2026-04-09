import { fieldContext, formContext } from "./context";
import { createFormHook } from "@tanstack/react-form";
import { PromptInputField } from "@/components/form/prompt-input";

export const { useAppForm: usePromptForm, withForm: withPromptForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    PromptInputField,
  },
  formComponents: {},
});
