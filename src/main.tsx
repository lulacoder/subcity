import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { ConvexReactClient } from 'convex/react'
import type { ComponentProps } from 'react'
import ReactDOM from 'react-dom/client'

import { authClient } from './lib/auth-client'
import { getRouter } from './router'

const convexUrl = import.meta.env.VITE_CONVEX_URL
if (!convexUrl) throw new Error('VITE_CONVEX_URL is not set.')

const convexClient = new ConvexReactClient(convexUrl, { expectAuth: true })
const convexQueryClient = new ConvexQueryClient(convexClient)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
})

convexQueryClient.connect(queryClient)
const router = getRouter()
const providerAuthClient = authClient as unknown as ComponentProps<
  typeof ConvexBetterAuthProvider
>['authClient']

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ConvexBetterAuthProvider client={convexClient} authClient={providerAuthClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConvexBetterAuthProvider>,
  )
}
