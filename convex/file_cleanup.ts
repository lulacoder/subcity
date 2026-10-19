import { v } from 'convex/values'

import { internal } from './_generated/api'
import { internalMutation } from './_generated/server'

const UPLOAD_GRACE_PERIOD = 24 * 60 * 60 * 1000

export const removeAbandonedUploads = internalMutation({
  args: { cursor: v.optional(v.string()), before: v.optional(v.number()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const before = args.before ?? Date.now() - UPLOAD_GRACE_PERIOD
    // The file library is this app's only storage user. Scan older uploads in
    // small batches so cleanup also catches uploads whose response was lost.
    const batch = await ctx.db.system
      .query('_storage')
      .withIndex('by_creation_time', (q) => q.lt('_creationTime', before))
      .paginate({ cursor: args.cursor ?? null, numItems: 50 })

    for (const file of batch.page) {
      const registered = await ctx.db
        .query('files')
        .withIndex('by_storageId', (q) => q.eq('storageId', file._id))
        .unique()
      if (!registered) await ctx.storage.delete(file._id)
    }

    if (!batch.isDone) {
      await ctx.scheduler.runAfter(
        0,
        internal.file_cleanup.removeAbandonedUploads,
        { cursor: batch.continueCursor, before },
      )
    }
    return null
  },
})
