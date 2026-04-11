import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/skill/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/skill/create"!</div>
}
