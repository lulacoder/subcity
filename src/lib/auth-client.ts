import {
  convexClient,
  crossDomainClient,
} from '@convex-dev/better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

export const convexAuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [convexClient(), crossDomainClient()],
})

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [adminClient(), convexClient(), crossDomainClient()],
})
