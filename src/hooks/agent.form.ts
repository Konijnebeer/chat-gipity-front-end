import { fieldContext, formContext } from "./context";
import { createFormHook } from "@tanstack/react-form";
import { InputField, TextAreaField, ComboBoxFieldIcons } from "@/components/form/shared";

export const { useAppForm: useAgentForm, withForm: withAgentForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    TextAreaField,
    ComboBoxFieldIcons,
  },
  formComponents: {},
});
