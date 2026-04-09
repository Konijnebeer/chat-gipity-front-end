import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/agent/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/agent/edit"!</div>
}
