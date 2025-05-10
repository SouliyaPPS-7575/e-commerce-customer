import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/view/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/blog/view/$id"!</div>
}
