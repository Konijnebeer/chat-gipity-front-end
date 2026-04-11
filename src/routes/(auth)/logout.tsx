import { Spinner } from "#/components/ui/spinner"
import { setAccessToken } from "#/lib/tokens"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/(auth)/logout")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Logout failed")
    },
    onSuccess: () => {
      setAccessToken(null)
      queryClient.clear() // wipe any cached user data
      navigate({ to: "/login" })
    },
  })

  useEffect(() => {
    logoutMutation.mutate()
  }, [])

  if (logoutMutation.isPending) {
    return (
      <main className="flex h-full w-full items-center justify-center">
        <Spinner className="size-10" />
      </main>
    )
  }

  if (logoutMutation.isError) {
    return (
      <main className="flex h-full w-full items-center justify-center">
        <p className="text-destructive">Logout failed. Please try again.</p>
      </main>
    )
  }

  return null
}
