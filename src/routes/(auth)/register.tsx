import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { FieldGroup } from "#/components/ui/field"
import { Spinner } from "#/components/ui/spinner"
import { useAccountForm } from "#/hooks/form/account.form"
import { UserRegisterSchema, type UserRegister } from "@chat-gipity/schemas"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

export const Route = createFileRoute("/(auth)/register")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (value: UserRegister) =>
      fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      }),
    onSuccess: () => {
      toast.success("Created account successfully!")
      navigate({ to: "/login" })
    },
    onError: (err: Error) => {
      console.log(err, "Registration error")
      toast.error(err.message)
    },
  })

  const form = useAccountForm({
    defaultValues: {
      name: "",
      email: "",
      // icon: "",
      // color: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      // // @ts-expect-error
      onSubmit: UserRegisterSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
  })

  return (
    <main>
      <Card className="mx-auto mt-10 w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.AppField
                name="name"
                children={(field) => (
                  <field.InputField
                    label="Name"
                    placeholder="Name"
                    autocomplete="name"
                  />
                )}
              />

              <form.AppField
                name="email"
                children={(field) => (
                  <field.InputField
                    label="Email"
                    placeholder="Email"
                    autocomplete="email"
                  />
                )}
              />

              {/* <div className="flex flex-col md:flex-row gap-4">
                <form.AppField
                  name="icon"
                  children={(field) => (
                    <field.IconPickerField label="Your Icon" />
                  )}
                />

                <form.AppField
                  name="color"
                  children={(field) => (
                    <field.InputField
                      label="Your Color"
                      placeholder="#000000"
                    />
                  )}
                />
              </div> */}

              <form.AppField
                name="password"
                children={(field) => (
                  <field.InputField
                    label="Password"
                    placeholder="Password"
                    type="password"
                    autocomplete="new-password"
                  />
                )}
              />

              <form.AppField
                name="confirmPassword"
                validators={{
                  onChangeListenTo: ["password"],
                  onChange: ({ value, fieldApi }) => {
                    const pw = fieldApi.form.getFieldValue("password")
                    if (pw && value !== pw) {
                      return { message: "Passwords do not match" }
                    }
                    return undefined
                  },
                }}
                children={(field) => (
                  <field.InputField
                    label="Confirm Password"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Confirm Password"
                  />
                )}
              />
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Spinner />}
                {mutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <span>Already have an account?</span>
          <Button variant="link" asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
