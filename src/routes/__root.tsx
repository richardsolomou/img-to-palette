import geistWoff2 from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import geistMonoWoff2 from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { chunkRecoveryScript, updateNoticeId } from '../client/chunkRecovery'
import { PostHogIntegration } from '../client/posthog'
import { DefaultCatchBoundary } from '../components/default-catch-boundary'
import { NotFound } from '../components/not-found'
import { seo } from '../lib/seo'
import styles from '../styles/app.css?url'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'img-to-palette.ras.sh | Color Palette Generator',
        description: '🎨 Generate color palettes from any image and find the nearest Tailwind colors for quick design matching.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: styles },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: geistWoff2, crossOrigin: 'anonymous' },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: geistMonoWoff2, crossOrigin: 'anonymous' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [{ children: chunkRecoveryScript }],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: Document,
  component: Root,
})

// A shell keeps the root's error and not-found pages inside the document, and `Root`'s providers inside the root's error boundary.
function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="dark min-h-dvh font-sans text-foreground antialiased">
        <p id={updateNoticeId} hidden className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">
          A new version is available. Reload the page to continue.
        </p>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function Root() {
  return (
    <PostHogIntegration>
      <Outlet />
    </PostHogIntegration>
  )
}
