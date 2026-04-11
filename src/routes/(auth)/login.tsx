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
import { setAccessToken } from "#/lib/tokens"
import { UserLoginSchema, type UserLogin } from "@chat-gipity/schemas"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (value: UserLogin) =>
      fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: value.email,
          password: value.password,
        }),
      }),
    onSuccess: (data) => {
      data
        .json()
        .then(({ accessToken }) => {
          setAccessToken(accessToken)
          toast.success("Logged in successfully!")
          // TODO: add redirect on basis of search param ?from= to send user back to page they were trying to access before login
          navigate({ to: "/" })
        })
        .catch((err) => {
          console.error("Failed to parse login response:", err)
          toast.error("Login succeeded but failed to process response")
        })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const form = useAccountForm({
    defaultValues: {
      email: "",

      password: "",
    },
    validators: {
      onSubmit: UserLoginSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
  })
  return (
    <main>
      <Card className="mx-auto mt-10 w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
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
                name="email"
                children={(field) => (
                  <field.InputField
                    label="Email"
                    placeholder="Email"
                    autocomplete="email"
                  />
                )}
              />

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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Spinner />}
                {mutation.isPending ? "Logging in..." : "Log In"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <span>Don't have an account?</span>
          <Button variant="link" asChild>
            <Link to="/register">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
