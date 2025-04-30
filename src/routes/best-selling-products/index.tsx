import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/best-selling-products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/best-selling-products/"!</div>
}
