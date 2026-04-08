import { createFileRoute } from '@tanstack/react-router'
import { chatRequestSchema, chatResponseSchema } from '@chat-gipity/schemas'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <h1 className="text-2xl font-bold">Gipity</h1>
    </main>
  )
}
