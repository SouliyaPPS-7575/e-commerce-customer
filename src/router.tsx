import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';
import Loading from './components/loading';
import { routeTree } from './routeTree.gen';
import { queryClient } from './services/queryClient';

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: 'intent',
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFound />,

      // This is the global fallback loading component.
      defaultPendingComponent: Loading,

      // Don't show the global pending component for navigations that complete in under 500ms.
      // This is the key to preventing the global loader from flashing on fast, in-page data refetches.
      defaultPendingMs: 500,

      // If the pending component does show, ensure it's displayed for at least 1000ms.
      // This prevents a jarring flash of the loader on screen for navigations that take just over 500ms.
      defaultPendingMinMs: 1000,

      // These settings are fine as they were.
      scrollRestoration: true, // It's generally better to let the router handle this.
    }),
    queryClient,
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
