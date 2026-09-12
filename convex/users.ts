import { v } from 'convex/values'

import { authComponent, createAuth } from './auth'
import { mutation } from './_generated/server'
import { requireAdmin } from './lib/auth'

export const changePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    if (args.newPassword.length < 12) {
      throw new Error('The new password must be at least 12 characters.')
    }

    const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
    await auth.api.changePassword({
      body: {
        currentPassword: args.currentPassword,
        newPassword: args.newPassword,
        revokeOtherSessions: true,
      },
      headers,
    })

    return null
  },
})
