/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import type { GenericDatabaseWriter, GenericDataModel } from 'convex/server'
import { describe, expect, test } from 'vitest'
import { z } from 'zod'

import { api, components } from './_generated/api'
import authSchema from './betterAuth/schema'
import { getFileNameError, getFileType, MAX_FILE_SIZE } from './lib/file_types'
import schema from './schema'

const modules = import.meta.glob([
  './**/*.ts',
  '!./betterAuth/**',
  '!./**/*.test.ts',
])
const authModules = import.meta.glob('./betterAuth/**/*.ts')
const createdRecord = z.object({ _id: z.string() })
const paginationOpts = { cursor: null, numItems: 20 }

async function setup() {
  const t = convexTest(schema, modules)
  t.registerComponent('betterAuth', authSchema, authModules)

  async function signIn(role: 'admin' | 'user') {
    const now = Date.now()
    const user = createdRecord.parse(
      await t.mutation(components.betterAuth.adapter.create, {
        input: {
          model: 'user',
          data: {
            email: `${role}@example.com`,
            name: role,
            emailVerified: true,
            role,
            createdAt: now,
            updatedAt: now,
          },
        },
      }),
    )
    const session = createdRecord.parse(
      await t.mutation(components.betterAuth.adapter.create, {
        input: {
          model: 'session',
          data: {
            userId: user._id,
            token: `${role}-session`,
            expiresAt: now + 60_000,
            createdAt: now,
            updatedAt: now,
          },
        },
      }),
    )
    return t.withIdentity({ subject: user._id, sessionId: session._id })
  }

  const admin = await signIn('admin')
  const user = await signIn('user')

  async function upload(
    name: string,
    contentType = getFileType(name)?.contentType ?? 'application/octet-stream',
    size = 4,
  ) {
    return t.run(async (ctx) => {
      const storageId = await ctx.storage.store(
        new Blob([new Uint8Array(size)], { type: contentType }),
      )
      // convex-test's Blob storage omits MIME metadata that the real upload endpoint records.
      const db: GenericDatabaseWriter<GenericDataModel> = ctx.db
      await db.patch('_storage', storageId, { contentType })
      return storageId
    })
  }

  async function save(name: string) {
    const storageId = await upload(name)
    const fileId = await admin.mutation(api.files.save, {
      storageId,
      originalName: name,
    })
    return { fileId, storageId }
  }

  return { t, admin, user, upload, save }
}

describe('admin file library', () => {
  test('shares filename validation with the browser before upload', () => {
    expect(getFileNameError('  Annual report.pdf  ')).toBeNull()
    expect(getFileNameError(' ')).toContain('between 1 and 180')
    expect(getFileNameError(`${'x'.repeat(180)}.pdf`)).toContain(
      'between 1 and 180',
    )
    for (const name of [
      '../report.pdf',
      'folder\\report.pdf',
      'bad\u0000.pdf',
      'bad\u007f.pdf',
    ]) {
      expect(getFileNameError(name)).toContain('path separators or control')
    }
  })

  test('requires an admin for every library operation', async () => {
    const { t, admin, user, save } = await setup()
    const { fileId, storageId } = await save('private-management.pdf')

    for (const client of [t, user]) {
      await expect(
        client.mutation(api.files.generateUploadUrl, {}),
      ).rejects.toThrow()
      await expect(
        client.query(api.files.list, { paginationOpts }),
      ).rejects.toThrow()
      await expect(
        client.mutation(api.files.save, {
          storageId,
          originalName: 'copy.pdf',
        }),
      ).rejects.toThrow()
      await expect(
        client.mutation(api.files.rename, { fileId, name: 'Changed.pdf' }),
      ).rejects.toThrow()
      await expect(
        client.mutation(api.files.remove, { fileId }),
      ).rejects.toThrow()
      await expect(
        client.mutation(api.files.discardUpload, { storageId }),
      ).rejects.toThrow()
    }

    expect(
      (await admin.query(api.files.list, { paginationOpts })).page,
    ).toHaveLength(1)
    expect(await admin.mutation(api.files.generateUploadUrl, {})).toContain(
      '/api/storage/upload',
    )
  })

  test.each([
    'photo.jpg',
    'photo.JPEG',
    'photo.png',
    'photo.webp',
    'photo.gif',
    'report.pdf',
    'letter.docx',
    'budget.xlsx',
    'slides.pptx',
  ])(
    'registers %s with verified metadata and an unauthenticated storage URL',
    async (name) => {
      const { t, admin, save } = await setup()
      const { fileId, storageId } = await save(name)
      const result = await admin.query(api.files.list, { paginationOpts })
      const directUrl = await t.run((ctx) => ctx.storage.getUrl(storageId))
      expect(result.page).toHaveLength(1)
      expect(result.page[0]).toMatchObject({
        _id: fileId,
        name,
        originalName: name,
        kind: getFileType(name)?.kind,
        contentType: getFileType(name)?.contentType,
        size: 4,
        uploadedBy: 'admin@example.com',
        url: directUrl,
      })
      expect(directUrl).toMatch(/^https:\/\//)
    },
  )

  test('registering the same storage ID is idempotent', async () => {
    const { admin, save } = await setup()
    const { fileId, storageId } = await save('report.pdf')
    expect(
      await admin.mutation(api.files.save, {
        storageId,
        originalName: 'retry.pdf',
      }),
    ).toBe(fileId)
    expect(
      (await admin.query(api.files.list, { paginationOpts })).page,
    ).toHaveLength(1)
  })

  test('rejects unsupported extensions, MIME mismatch, empty, oversized, missing files, and invalid names', async () => {
    const { t, admin, upload } = await setup()
    for (const name of [
      'movie.mp4',
      'audio.mp3',
      'page.html',
      'vector.svg',
      'old.doc',
      'old.xls',
      'old.ppt',
    ]) {
      const storageId = await upload(name)
      await expect(
        admin.mutation(api.files.save, { storageId, originalName: name }),
      ).rejects.toThrow('not supported')
      await admin.mutation(api.files.discardUpload, { storageId })
    }

    const mismatched = await upload('report.pdf', 'image/png')
    await expect(
      admin.mutation(api.files.save, {
        storageId: mismatched,
        originalName: 'report.pdf',
      }),
    ).rejects.toThrow('does not match')

    for (const size of [0, MAX_FILE_SIZE + 1]) {
      const storageId = await upload('report.pdf', 'application/pdf', size)
      await expect(
        admin.mutation(api.files.save, {
          storageId,
          originalName: 'report.pdf',
        }),
      ).rejects.toThrow('25 MB')
    }

    const missing = await upload('report.pdf')
    await t.run((ctx) => ctx.storage.delete(missing))
    await expect(
      admin.mutation(api.files.save, {
        storageId: missing,
        originalName: 'report.pdf',
      }),
    ).rejects.toThrow('could not be found')

    const storageId = await upload('report.pdf')
    for (const name of [
      ' ',
      '../report.pdf',
      'folder\\report.pdf',
      'bad\u0000.pdf',
      `${'x'.repeat(181)}.pdf`,
    ]) {
      await expect(
        admin.mutation(api.files.save, { storageId, originalName: name }),
      ).rejects.toThrow()
    }
    expect(
      (await admin.query(api.files.list, { paginationOpts })).page,
    ).toHaveLength(0)
  })

  test('paginates and searches the whole library with indexed kind filters', async () => {
    const { admin, save } = await setup()
    await save('annual archive.pdf')
    await save('annual portrait.png')
    await save('newest notice.pdf')

    const first = await admin.query(api.files.list, {
      paginationOpts: { cursor: null, numItems: 1 },
    })
    expect(first.page.map((file) => file.name)).toEqual(['newest notice.pdf'])
    expect(first.isDone).toBe(false)
    const next = await admin.query(api.files.list, {
      paginationOpts: { cursor: first.continueCursor, numItems: 2 },
    })
    expect(next.page.map((file) => file.name)).toEqual([
      'annual portrait.png',
      'annual archive.pdf',
    ])

    const search = await admin.query(api.files.list, {
      paginationOpts,
      search: 'archive',
    })
    expect(search.page.map((file) => file.name)).toEqual(['annual archive.pdf'])
    const filtered = await admin.query(api.files.list, {
      paginationOpts,
      search: 'annual',
      kind: 'image',
    })
    expect(filtered.page.map((file) => file.name)).toEqual([
      'annual portrait.png',
    ])
    const pdfs = await admin.query(api.files.list, {
      paginationOpts,
      kind: 'pdf',
    })
    expect(pdfs.page.map((file) => file.name)).toEqual([
      'newest notice.pdf',
      'annual archive.pdf',
    ])
  })

  test('renames the display name while preserving file data and the shared URL', async () => {
    const { t, admin, save } = await setup()
    const { fileId, storageId } = await save('original.pdf')
    const url = await t.run((ctx) => ctx.storage.getUrl(storageId))
    await admin.mutation(api.files.rename, {
      fileId,
      name: '  New title.pdf  ',
    })
    expect(
      (await admin.query(api.files.list, { paginationOpts })).page[0],
    ).toMatchObject({
      name: 'New title.pdf',
      originalName: 'original.pdf',
      storageId,
      url,
    })
    expect(
      (await admin.query(api.files.list, { paginationOpts, search: 'New' }))
        .page,
    ).toHaveLength(1)
    await expect(
      admin.mutation(api.files.rename, { fileId, name: '../bad.pdf' }),
    ).rejects.toThrow()
  })

  test('discard only removes unregistered uploads, while deleting removes bytes and the library record', async () => {
    const { t, admin, save, upload } = await setup()
    const { fileId, storageId } = await save('report.pdf')
    await expect(
      admin.mutation(api.files.discardUpload, { storageId }),
    ).rejects.toThrow('Registered files')
    expect(
      await t.run(async (ctx) => (await ctx.storage.get(storageId))?.size),
    ).toBe(4)

    await admin.mutation(api.files.remove, { fileId })
    expect(await t.run((ctx) => ctx.db.get('files', fileId))).toBeNull()
    expect(await t.run((ctx) => ctx.storage.get(storageId))).toBeNull()
    expect(await t.run((ctx) => ctx.storage.getUrl(storageId))).toBeNull()
    await admin.mutation(api.files.remove, { fileId })

    const abandoned = await upload('abandoned.pdf')
    await admin.mutation(api.files.discardUpload, { storageId: abandoned })
    expect(await t.run((ctx) => ctx.storage.get(abandoned))).toBeNull()
    await admin.mutation(api.files.discardUpload, { storageId: abandoned })
    await expect(
      admin.mutation(api.files.rename, { fileId, name: 'Missing.pdf' }),
    ).rejects.toThrow('not found')
  })
})
