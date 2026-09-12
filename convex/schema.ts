import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const socialLinksValidator = v.object({
  facebook: v.optional(v.string()),
  instagram: v.optional(v.string()),
  tiktok: v.optional(v.string()),
  youtube: v.optional(v.string()),
  x: v.optional(v.string()),
})

export const areaTypeValidator = v.union(
  v.literal('city'),
  v.literal('subcity'),
  v.literal('woreda'),
)

export default defineSchema({
  areas: defineTable({
    type: areaTypeValidator,
    name: v.string(),
    parentId: v.optional(v.id('areas')),
    woredaNumber: v.optional(v.number()),
    displayOrder: v.number(),
    active: v.boolean(),
    links: socialLinksValidator,
    updatedAt: v.number(),
    updatedBy: v.string(),
  })
    .index('by_type_and_displayOrder', ['type', 'displayOrder'])
    .index('by_parentId_and_displayOrder', ['parentId', 'displayOrder'])
    .index('by_type_and_woredaNumber', ['type', 'woredaNumber']),
})
