import { httpRouter } from 'convex/server'

import { api, internal } from './_generated/api'
import type { Id } from './_generated/dataModel'
import { env, httpAction } from './_generated/server'
import { authComponent, createAuth } from './auth'

const http = httpRouter()

const publicHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
}

authComponent.registerRoutesLazy(http, createAuth, {
  cors: true,
  trustedOrigins: [process.env.SITE_URL ?? 'http://localhost:3000'],
})

http.route({
  path: '/survey-public',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const slug = new URL(request.url).searchParams.get('slug')
    if (!slug) {
      return Response.json(
        { error: 'Survey link is required.' },
        { status: 400, headers: publicHeaders },
      )
    }
    const survey = await ctx.runQuery(api.surveys.getPublicBySlug, { slug })
    return Response.json(survey, { headers: publicHeaders })
  }),
})

http.route({
  path: '/survey-featured',
  method: 'GET',
  handler: httpAction(async (ctx) => {
    const survey = await ctx.runQuery(api.surveys.getFeatured, {})
    return Response.json(survey, { headers: publicHeaders })
  }),
})

http.route({
  path: '/survey-submit',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const expectedSecret = env.SURVEY_API_SECRET
    if (
      !expectedSecret ||
      request.headers.get('authorization') !== `Bearer ${expectedSecret}`
    ) {
      return Response.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json(
        { error: 'Invalid survey response.' },
        { status: 400 },
      )
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json(
        { error: 'Invalid survey response.' },
        { status: 400 },
      )
    }

    const value = body as Record<string, unknown>
    if (
      typeof value.surveyId !== 'string' ||
      typeof value.ipHash !== 'string' ||
      !/^[a-f0-9]{64}$/.test(value.ipHash) ||
      !Array.isArray(value.answers)
    ) {
      return Response.json(
        { error: 'Invalid survey response.' },
        { status: 400 },
      )
    }

    const answers: Array<{ questionId: string; value: string | number }> = []
    for (const answer of value.answers) {
      if (!answer || typeof answer !== 'object' || Array.isArray(answer)) {
        return Response.json(
          { error: 'Invalid survey response.' },
          { status: 400 },
        )
      }
      const item = answer as Record<string, unknown>
      if (
        typeof item.questionId !== 'string' ||
        (typeof item.value !== 'string' && typeof item.value !== 'number')
      ) {
        return Response.json(
          { error: 'Invalid survey response.' },
          { status: 400 },
        )
      }
      answers.push({ questionId: item.questionId, value: item.value })
    }

    try {
      const result: { remaining: number } = await ctx.runMutation(
        internal.surveys.submitInternal,
        {
          surveyId: value.surveyId as Id<'surveys'>,
          ipHash: value.ipHash,
          answers,
        },
      )
      return Response.json(result, {
        status: 201,
        headers: { 'Cache-Control': 'no-store' },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('SURVEY_LIMIT_REACHED')) {
        return Response.json(
          { error: 'This network has already submitted twice.' },
          { status: 429 },
        )
      }
      if (message.includes('SURVEY_NOT_LIVE')) {
        return Response.json(
          { error: 'This survey is not accepting responses.' },
          { status: 409 },
        )
      }
      const validationMessage = message.match(/ConvexError:\s*([^\n]+)/)?.[1]
      return Response.json(
        { error: validationMessage ?? 'Check the response and try again.' },
        { status: 400 },
      )
    }
  }),
})

export default http
