import { Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import i18next from 'i18next';
import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'sonner';
import { CurrencyProvider } from '~/components/CurrencySelector/CurrencyProvider';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NotFound } from '~/components/NotFound';
import PWAInstall from '~/components/PWAInstall';
import { useContact, whatsappLinkQueryOption } from '~/hooks/useContact';
import Navbar from '~/layout/navbar';
import { queryClient } from '~/services/queryClient';
import appCss from '~/styles/app.css?url';
import MuiProvider from '~/styles/ThemeProvider';
import { seo } from '~/utils/seo';
import { isDevelopment } from '~/utils/url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'E-Commerce Customer',
        description: `E-Commerce Customer`,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/images/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#FBF8F4' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
  loader: async ({ context }) => {
    const whatsappLink = context.queryClient.ensureQueryData(
      whatsappLinkQueryOption(),
    );
    return { whatsappLink };
  },
});

function RootComponent() {
  // Current Path URL
  const location = useRouterState({ select: (state) => state.location });
  const currentPath = location.pathname;

  // Check if we should show the navbar on this route
  const isPublicRoute = ['/', '/login', '/signup', '/forgot-password'].includes(
    currentPath,
  );

  return (
    <RootDocument>
      {!isPublicRoute ? (
        <>
          <Navbar />
          <Box>
            <Outlet />
          </Box>
        </>
      ) : (
        <Box>
          <Outlet />
        </Box>
      )}
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { whatsappLink } = useContact();

  return (
    <html>
      <head>
        <PWAInstall />
        <HeadContent />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;700&family=Phetsarath+OT:wght@400;700&family=Poppins:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <script src="https://unpkg.com/react-phone-input-2@2.x/dist/lib.js"></script>
      </head>
      <body suppressHydrationWarning>
        <I18nextProvider i18n={i18next}>
          <QueryClientProvider client={queryClient}>
            <MuiProvider>
              <CurrencyProvider>
                {children}
                {/* Alternative Design with Custom WhatsApp SVG */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-4 right-3 bg-[#E8D9B1] hover:bg-[#d7c9a5] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 z-50 group"
                  aria-label="Contact us on WhatsApp"
                >
                  {/* Custom WhatsApp SVG Icon */}
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63" />
                  </svg>

                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                </a>
              </CurrencyProvider>
              <Toaster
                visibleToasts={9}
                position="top-right"
                closeButton
                duration={3000}
                richColors
                toastOptions={{
                  duration: 3000,
                  className: 'custom-toast',
                }}
              />
              {isDevelopment && (
                <TanStackRouterDevtools position="bottom-right" />
              )}
              <ReactQueryDevtools buttonPosition="bottom-left" />
            </MuiProvider>
          </QueryClientProvider>
        </I18nextProvider>
        <Scripts />
      </body>
    </html>
  );
}
