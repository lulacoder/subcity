import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server'
import { ConvexError, v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/auth'
import {
  getFileType,
  getFileNameError,
  MAX_FILE_NAME_LENGTH,
  MAX_FILE_SIZE,
} from './lib/file_types'
import schema, { fileKindValidator } from './schema'

function validateName(value: string) {
  const error = getFileNameError(value)
  if (error) throw new ConvexError(error)
  return value.trim()
}

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.storage.generateUploadUrl()
  },
})

export const save = mutation({
  args: { storageId: v.id('_storage'), originalName: v.string() },
  returns: v.id('files'),
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx)
    const existing = await ctx.db
      .query('files')
      .withIndex('by_storageId', (q) => q.eq('storageId', args.storageId))
      .unique()
    if (existing) return existing._id

    const originalName = validateName(args.originalName)
    const type = getFileType(originalName)
    if (!type) throw new ConvexError('This file type is not supported.')

    const metadata = await ctx.db.system.get('_storage', args.storageId)
    if (!metadata)
      throw new ConvexError('The uploaded file could not be found.')
    if (metadata.size <= 0 || metadata.size > MAX_FILE_SIZE) {
      throw new ConvexError('Files must be nonempty and no larger than 25 MB.')
    }
    if (metadata.contentType !== type.contentType) {
      throw new ConvexError(
        'The uploaded file type does not match its extension.',
      )
    }

    return ctx.db.insert('files', {
      storageId: args.storageId,
      name: originalName,
      originalName,
      kind: type.kind,
      contentType: type.contentType,
      size: metadata.size,
      uploadedBy: admin.email,
    })
  },
})

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    kind: v.optional(fileKindValidator),
  },
  returns: paginationResultValidator(
    schema.doc('files').extend({ url: v.union(v.string(), v.null()) }),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const search = args.search?.trim() ?? ''
    const kind = args.kind
    if (search.length > MAX_FILE_NAME_LENGTH) {
      throw new ConvexError('The search text is too long.')
    }

    const files = search
      ? ctx.db.query('files').withSearchIndex('search_name', (q) => {
          const matches = q.search('name', search)
          return kind ? matches.eq('kind', kind) : matches
        })
      : kind
        ? ctx.db
            .query('files')
            .withIndex('by_kind', (q) => q.eq('kind', kind))
            .order('desc')
        : ctx.db.query('files').withIndex('by_creation_time').order('desc')

    const result = await files.paginate(args.paginationOpts)
    return {
      ...result,
      page: await Promise.all(
        result.page.map(async (file) => ({
          ...file,
          url: await ctx.storage.getUrl(file.storageId),
        })),
      ),
    }
  },
})

export const rename = mutation({
  args: { fileId: v.id('files'), name: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const name = validateName(args.name)
    if (!(await ctx.db.get('files', args.fileId))) {
      throw new ConvexError('File not found.')
    }
    await ctx.db.patch('files', args.fileId, { name })
    return null
  },
})

export const remove = mutation({
  args: { fileId: v.id('files') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const file = await ctx.db.get('files', args.fileId)
    if (file) {
      await ctx.storage.delete(file.storageId)
      await ctx.db.delete('files', file._id)
    }
    return null
  },
})

export const discardUpload = mutation({
  args: { storageId: v.id('_storage') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const existing = await ctx.db
      .query('files')
      .withIndex('by_storageId', (q) => q.eq('storageId', args.storageId))
      .unique()
    // A save may have succeeded even if its response never reached the browser.
    if (existing) return null

    if (await ctx.db.system.get('_storage', args.storageId)) {
      await ctx.storage.delete(args.storageId)
    }
    return null
  },
})
