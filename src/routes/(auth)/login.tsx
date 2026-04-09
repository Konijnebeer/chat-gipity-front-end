import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <h1>Login</h1>
      <p>Welcome to the login page!</p>
    </main>
  )
}
