import { hashPassword } from 'better-auth/crypto'
import { v } from 'convex/values'

import { mutation } from './_generated/server'

export const upsertAdmin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  returns: v.object({
    created: v.boolean(),
    sessionsRevoked: v.number(),
  }),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase()
    const name = args.name.trim()

    if (!email || !email.includes('@')) {
      throw new Error('Enter a valid admin email address.')
    }

    if (args.password.length < 12) {
      throw new Error('The admin password must be at least 12 characters.')
    }

    const password = await hashPassword(args.password)
    const now = Date.now()
    const matchingUsers = await ctx.db
      .query('user')
      .withIndex('email_name', (query) => query.eq('email', email))
      .take(2)

    if (matchingUsers.length > 1) {
      throw new Error('More than one auth user has this email address.')
    }

    const existingUser = matchingUsers[0]
    let userId: string
    let created = false

    if (existingUser) {
      userId = existingUser._id
      await ctx.db.patch(existingUser._id, {
        name,
        role: 'admin',
        banned: false,
        banReason: null,
        banExpires: null,
        updatedAt: now,
      })
    } else {
      created = true
      userId = await ctx.db.insert('user', {
        name,
        email,
        emailVerified: true,
        role: 'admin',
        banned: false,
        banReason: null,
        banExpires: null,
        createdAt: now,
        updatedAt: now,
      })
    }

    const credentialAccounts = await ctx.db
      .query('account')
      .withIndex('providerId_userId', (query) =>
        query.eq('providerId', 'credential').eq('userId', userId),
      )
      .take(2)

    if (credentialAccounts.length > 1) {
      throw new Error('More than one credential account exists for this admin.')
    }

    const credentialAccount = credentialAccounts[0]

    if (credentialAccount) {
      await ctx.db.patch(credentialAccount._id, {
        accountId: userId,
        password,
        updatedAt: now,
      })
    } else {
      await ctx.db.insert('account', {
        accountId: userId,
        providerId: 'credential',
        userId,
        password,
        createdAt: now,
        updatedAt: now,
      })
    }

    const sessions = await ctx.db
      .query('session')
      .withIndex('userId', (query) => query.eq('userId', userId))
      .take(100)

    for (const session of sessions) {
      await ctx.db.delete(session._id)
    }

    return { created, sessionsRevoked: sessions.length }
  },
})
