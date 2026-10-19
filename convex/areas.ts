import { paginationOptsValidator, paginationResultValidator } from 'convex/server'
import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/auth'
import { validatePlatformUrl } from './lib/links'
import schema, { socialLinksValidator } from './schema'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('areas').take(100)
  },
})

// eslint-disable-next-line @convex-dev/require-access-control -- Active directory entries are intentionally public.
export const listPublic = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(schema.doc('areas')),
  handler: async (ctx, args) => {
    return ctx.db
      .query('areas')
      .withIndex('by_active_and_type_and_displayOrder', (q) => q.eq('active', true))
      .paginate(args.paginationOpts)
  },
})

export const getById = query({
  args: { areaId: v.id('areas') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db.get('areas', args.areaId)
  },
})

export const updateLinks = mutation({
  args: {
    areaId: v.id('areas'),
    links: socialLinksValidator,
  },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx)
    const area = await ctx.db.get('areas', args.areaId)

    if (!area) throw new Error('Area not found.')

    await ctx.db.patch('areas', args.areaId, {
      links: {
        facebook: validatePlatformUrl('facebook', args.links.facebook ?? ''),
        instagram: validatePlatformUrl('instagram', args.links.instagram ?? ''),
        tiktok: validatePlatformUrl('tiktok', args.links.tiktok ?? ''),
        youtube: validatePlatformUrl('youtube', args.links.youtube ?? ''),
        x: validatePlatformUrl('x', args.links.x ?? ''),
      },
      updatedAt: Date.now(),
      updatedBy: adminUser.email,
    })

    return null
  },
})

export const createWoreda = mutation({
  args: {
    name: v.string(),
    woredaNumber: v.number(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx)
    const name = args.name.trim()

    if (!name) throw new Error('Woreda name is required.')
    if (!Number.isInteger(args.woredaNumber) || args.woredaNumber < 1) {
      throw new Error('Woreda number must be a positive whole number.')
    }

    const existing = await ctx.db
      .query('areas')
      .withIndex('by_type_and_woredaNumber', (q) =>
        q.eq('type', 'woreda').eq('woredaNumber', args.woredaNumber),
      )
      .unique()

    if (existing) throw new Error('A woreda with this number already exists.')

    const subcity = await ctx.db
      .query('areas')
      .withIndex('by_type_and_displayOrder', (q) =>
        q.eq('type', 'subcity'),
      )
      .first()

    if (!subcity) throw new Error('Seed the Akaki Kality Prosperity Party (PR) area first.')

    return ctx.db.insert('areas', {
      type: 'woreda',
      name,
      parentId: subcity._id,
      woredaNumber: args.woredaNumber,
      displayOrder: args.displayOrder,
      active: true,
      links: {},
      updatedAt: Date.now(),
      updatedBy: adminUser.email,
    })
  },
})

export const updateWoreda = mutation({
  args: {
    areaId: v.id('areas'),
    name: v.string(),
    displayOrder: v.number(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx)
    const area = await ctx.db.get('areas', args.areaId)

    if (!area || area.type !== 'woreda') {
      throw new Error('Woreda not found.')
    }

    const name = args.name.trim()
    if (!name) throw new Error('Woreda name is required.')

    await ctx.db.patch('areas', args.areaId, {
      name,
      displayOrder: args.displayOrder,
      active: args.active,
      updatedAt: Date.now(),
      updatedBy: adminUser.email,
    })

    return null
  },
})
