import { createFileRoute } from '@tanstack/react-router';
import FooterSection from '~/containers/home/sections/FooterSection';

export const Route = createFileRoute('/contact/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <FooterSection />;
}
