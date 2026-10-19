/// <reference types="vite/client" />

import { convexTest } from 'convex-test'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { api, components, internal } from './_generated/api'
import type { Doc } from './_generated/dataModel'
import { createAuthOptions } from './auth'
import authSchema from './betterAuth/schema'
import schema from './schema'

const modules = import.meta.glob('./**/*.{ts,js}')
const authModules = import.meta.glob('./betterAuth/**/*.{ts,js}')
const documentId = z.object({ _id: z.string() })
const seedIdentity = {
  subject: 'admin-seed',
  issuer: 'https://seed.local',
  tokenIdentifier: 'https://seed.local|admin-seed',
}

function createTest() {
  const t = convexTest(schema, modules)
  t.registerComponent('betterAuth', authSchema, authModules)
  return t
}

type TestApp = ReturnType<typeof createTest>

async function signedIn(t: TestApp, role: 'admin' | 'user') {
  const now = Date.now()
  const user = documentId.parse(
    await t.mutation(components.betterAuth.adapter.create, {
      input: {
        model: 'user',
        data: {
          name: role,
          email: `${role}@example.com`,
          emailVerified: true,
          role,
          createdAt: now,
          updatedAt: now,
        },
      },
    }),
  )
  const session = documentId.parse(
    await t.mutation(components.betterAuth.adapter.create, {
      input: {
        model: 'session',
        data: {
          userId: user._id,
          token: `${role}-session`,
          expiresAt: now + 3_600_000,
          createdAt: now,
          updatedAt: now,
        },
      },
    }),
  )
  return t.withIdentity({
    subject: user._id,
    sessionId: session._id,
    issuer: 'https://test.convex.site',
    tokenIdentifier: `https://test.convex.site|${user._id}`,
  })
}

function addArea(
  t: TestApp,
  fields: Partial<Omit<Doc<'areas'>, '_id' | '_creationTime'>> = {},
) {
  return t.run((ctx) =>
    ctx.db.insert('areas', {
      type: 'woreda',
      name: 'Woreda 1',
      displayOrder: 1,
      active: true,
      links: {},
      updatedAt: Date.now(),
      updatedBy: 'test',
      ...fields,
    }),
  )
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('public area pagination', () => {
  it('returns every active area in type and display order across pages', async () => {
    const t = createTest()
    await addArea(t, { name: 'Woreda 2', displayOrder: 2 })
    await addArea(t, { name: 'City', type: 'city', displayOrder: 0 })
    await addArea(t, { name: 'Hidden', active: false, displayOrder: 0 })
    await addArea(t, { name: 'Subcity', type: 'subcity', displayOrder: 0 })
    await addArea(t)

    const first = await t.query(api.areas.listPublic, {
      paginationOpts: { numItems: 2, cursor: null },
    })
    expect(first.page.map((area) => area.name)).toEqual(['City', 'Subcity'])
    expect(first.isDone).toBe(false)

    const second = await t.query(api.areas.listPublic, {
      paginationOpts: { numItems: 2, cursor: first.continueCursor },
    })
    expect(second.page.map((area) => area.name)).toEqual([
      'Woreda 1',
      'Woreda 2',
    ])
    expect(second.isDone).toBe(true)
  })

  it('returns an empty completed page when no active areas exist', async () => {
    const t = createTest()
    await addArea(t, { active: false })
    const result = await t.query(api.areas.listPublic, {
      paginationOpts: { numItems: 10, cursor: null },
    })
    expect(result.page).toEqual([])
    expect(result.isDone).toBe(true)
  })
})

describe('admin access', () => {
  it('rejects anonymous and non-admin reads and writes, and allows an admin', async () => {
    const t = createTest()
    const areaId = await addArea(t)
    const changes = { areaId, name: 'Updated', displayOrder: 2, active: true }
    await expect(t.query(api.areas.list, {})).rejects.toThrow('Unauthenticated')
    await expect(t.mutation(api.areas.updateWoreda, changes)).rejects.toThrow(
      'Unauthenticated',
    )

    const user = await signedIn(t, 'user')
    await expect(user.query(api.areas.list, {})).rejects.toThrow('Admin access')
    await expect(
      user.mutation(api.areas.updateWoreda, changes),
    ).rejects.toThrow('Admin access')

    const admin = await signedIn(t, 'admin')
    await admin.mutation(api.areas.updateWoreda, changes)
    expect(await admin.query(api.areas.getById, { areaId })).toMatchObject({
      name: 'Updated',
      displayOrder: 2,
    })
  })

  it('requires a real Better Auth session for the current-user query', async () => {
    const t = createTest()
    await expect(t.query(api.auth.getCurrentUser, {})).rejects.toThrow(
      'Unauthenticated',
    )
    const user = await signedIn(t, 'user')
    expect(await user.query(api.auth.getCurrentUser, {})).toMatchObject({
      email: 'user@example.com',
      role: 'user',
    })
  })
})

describe('developer seeds', () => {
  it('rejects callers without the developer CLI identity before writing', async () => {
    const t = createTest()
    for (const caller of [
      t,
      t.withIdentity({
        subject: 'admin-seed',
        issuer: 'https://untrusted.example',
      }),
      t.withIdentity({ subject: 'other', issuer: 'https://seed.local' }),
    ]) {
      await expect(
        caller.mutation(internal.seed.directory, {}),
      ).rejects.toThrow('developer CLI')
      await expect(
        caller.mutation(internal.seed.admin, {
          email: 'seed@example.com',
          name: 'Seed Admin',
          password: 'test-password-123',
        }),
      ).rejects.toThrow('developer CLI')
    }
    expect(await t.run((ctx) => ctx.db.query('areas').take(1))).toEqual([])
  })

  it('creates an admin once and updates it on a second authorized seed', async () => {
    const t = createTest()
    const seed = t.withIdentity(seedIdentity)
    const args = {
      email: 'seed@example.com',
      name: 'Seed Admin',
      password: 'test-password-123',
    }
    expect(await seed.mutation(internal.seed.admin, args)).toMatchObject({
      created: true,
      sessionsRevoked: 0,
    })
    const user = documentId.parse(
      await t.query(components.betterAuth.adapter.findOne, {
        model: 'user',
        where: [{ field: 'email', value: args.email }],
      }),
    )
    const now = Date.now()
    const session = documentId.parse(
      await t.mutation(components.betterAuth.adapter.create, {
        input: {
          model: 'session',
          data: {
            userId: user._id,
            token: 'seed-session',
            expiresAt: now + 3_600_000,
            createdAt: now,
            updatedAt: now,
          },
        },
      }),
    )
    expect(
      await seed.mutation(internal.seed.admin, {
        ...args,
        password: 'updated-test-password-123',
      }),
    ).toEqual({
      created: false,
      sessionsRevoked: 1,
      createdWoredas: 0,
    })
    await expect(
      t
        .withIdentity({ subject: user._id, sessionId: session._id })
        .query(api.auth.getCurrentUser, {}),
    ).rejects.toThrow('Unauthenticated')
  })
})

it('reads survey stats by prefix and cleans every batch without touching another survey', async () => {
  vi.useFakeTimers()
  const t = createTest()
  const admin = await signedIn(t, 'admin')
  const surveyId = await admin.mutation(api.surveys.create, {
    title: 'First survey',
    slug: 'first-survey',
    questions: [],
  })
  const otherId = await admin.mutation(api.surveys.create, {
    title: 'Other survey',
    slug: 'other-survey',
    questions: [],
  })
  await t.run(async (ctx) => {
    for (let index = 0; index < 101; index++) {
      await ctx.db.insert('surveyAnswerStats', {
        surveyId,
        questionId: `question-${index}`,
        valueKey: 'yes',
        count: 1,
      })
    }
    await ctx.db.insert('surveyAnswerStats', {
      surveyId: otherId,
      questionId: 'other-question',
      valueKey: 'yes',
      count: 7,
    })
  })
  const stats = await admin.query(api.surveys.getStats, { surveyId })
  expect(stats).toHaveLength(101)
  expect(stats.every((stat) => stat.surveyId === surveyId)).toBe(true)
  await admin.mutation(api.surveys.remove, { surveyId })
  await t.finishAllScheduledFunctions(vi.runAllTimers)
  expect(await admin.query(api.surveys.getStats, { surveyId })).toEqual([])
  expect(
    await admin.query(api.surveys.getStats, { surveyId: otherId }),
  ).toMatchObject([{ count: 7 }])
})

it('preserves auth origins and the optional SITE_URL localhost fallback', async () => {
  const t = createTest()
  vi.stubEnv('SITE_URL', undefined)
  expect(
    await t.run(async (ctx) => createAuthOptions(ctx).trustedOrigins),
  ).toEqual(['http://localhost:3000'])
  vi.stubEnv('SITE_URL', 'https://directory.example.com')
  expect(
    await t.run(async (ctx) => createAuthOptions(ctx).trustedOrigins),
  ).toEqual(['https://directory.example.com'])
})
