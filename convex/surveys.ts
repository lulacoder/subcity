import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server'
import { ConvexError, v } from 'convex/values'

import { internal } from './_generated/api'
import { internalMutation, mutation, query } from './_generated/server'
import type { MutationCtx } from './_generated/server'
import { requireAdmin } from './lib/auth'
import {
  surveyAnswerValidator,
  surveyQuestionValidator,
  surveyStatusValidator,
} from './schema'

const MAX_QUESTIONS = 20
const MAX_OPTIONS = 10
const MAX_SHORT_TEXT = 200
const MAX_LONG_TEXT = 2_000

function cleanSlug(value: string) {
  return value.trim().toLowerCase()
}

function validateSurveyInput(args: {
  title: string
  description?: string
  slug: string
  questions: Array<{
    id: string
    type: 'short_text' | 'long_text' | 'single_choice' | 'rating'
    prompt: string
    required: boolean
    active: boolean
    displayOrder: number
    options: Array<{ id: string; label: string }>
  }>
}) {
  if (!args.title.trim() || args.title.trim().length > 120) {
    throw new ConvexError('Title must be between 1 and 120 characters.')
  }
  if ((args.description?.trim().length ?? 0) > 500) {
    throw new ConvexError('Description cannot exceed 500 characters.')
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug(args.slug))) {
    throw new ConvexError(
      'The public link may contain lowercase letters, numbers, and hyphens.',
    )
  }

  const activeQuestions = args.questions.filter((question) => question.active)
  if (activeQuestions.length > MAX_QUESTIONS) {
    throw new ConvexError(
      `A survey can have at most ${MAX_QUESTIONS} questions.`,
    )
  }

  const questionIds = new Set<string>()
  for (const question of args.questions) {
    if (!question.id || questionIds.has(question.id)) {
      throw new ConvexError('Every question must have a unique ID.')
    }
    questionIds.add(question.id)
    if (!question.prompt.trim() || question.prompt.trim().length > 300) {
      throw new ConvexError(
        'Question wording must be between 1 and 300 characters.',
      )
    }
    if (question.type === 'single_choice') {
      if (
        question.options.length < 2 ||
        question.options.length > MAX_OPTIONS
      ) {
        throw new ConvexError(
          `A choice question needs between 2 and ${MAX_OPTIONS} options.`,
        )
      }
      const optionIds = new Set<string>()
      for (const option of question.options) {
        if (!option.id || optionIds.has(option.id) || !option.label.trim()) {
          throw new ConvexError('Choice options must be named and unique.')
        }
        if (option.label.trim().length > 120) {
          throw new ConvexError('A choice option cannot exceed 120 characters.')
        }
        optionIds.add(option.id)
      }
    }
  }
}

function validateAnswers(
  survey: {
    questions: Array<{
      id: string
      type: 'short_text' | 'long_text' | 'single_choice' | 'rating'
      prompt: string
      required: boolean
      active: boolean
      displayOrder: number
      options: Array<{ id: string; label: string }>
    }>
  },
  answers: Array<{ questionId: string; value: string | number }>,
) {
  const activeQuestions = survey.questions.filter((question) => question.active)
  const answerMap = new Map(
    answers.map((answer) => [answer.questionId, answer]),
  )

  if (answerMap.size !== answers.length) {
    throw new ConvexError('A question can only be answered once.')
  }

  for (const answer of answers) {
    if (
      !activeQuestions.some((question) => question.id === answer.questionId)
    ) {
      throw new ConvexError('The response contains an unknown question.')
    }
  }

  for (const question of activeQuestions) {
    const answer = answerMap.get(question.id)
    if (!answer) {
      if (question.required) {
        throw new ConvexError(`Please answer: ${question.prompt}`)
      }
      continue
    }
    const empty = typeof answer.value === 'string' && !answer.value.trim()
    if (question.required && empty) {
      throw new ConvexError(`Please answer: ${question.prompt}`)
    }
    if (empty) continue

    if (question.type === 'rating') {
      if (
        typeof answer.value !== 'number' ||
        !Number.isInteger(answer.value) ||
        answer.value < 1 ||
        answer.value > 5
      ) {
        throw new ConvexError('Ratings must be whole numbers from 1 to 5.')
      }
      continue
    }

    if (typeof answer.value !== 'string') {
      throw new ConvexError('This answer must be text.')
    }
    if (
      question.type === 'short_text' &&
      answer.value.trim().length > MAX_SHORT_TEXT
    ) {
      throw new ConvexError(
        `Short answers cannot exceed ${MAX_SHORT_TEXT} characters.`,
      )
    }
    if (
      question.type === 'long_text' &&
      answer.value.trim().length > MAX_LONG_TEXT
    ) {
      throw new ConvexError(
        `Long answers cannot exceed ${MAX_LONG_TEXT} characters.`,
      )
    }
    if (
      question.type === 'single_choice' &&
      !question.options.some((option) => option.id === answer.value)
    ) {
      throw new ConvexError('Select one of the available choices.')
    }
  }
}

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('surveys').order('desc').take(100)
  },
})

export const getAdmin = query({
  args: { surveyId: v.id('surveys') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db.get('surveys', args.surveyId)
  },
})

export const getPublicBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const survey = await ctx.db
      .query('surveys')
      .withIndex('by_slug', (q) => q.eq('slug', cleanSlug(args.slug)))
      .unique()
    if (!survey) return null
    return {
      _id: survey._id,
      title: survey.title,
      description: survey.description,
      slug: survey.slug,
      status: survey.status,
      questions: survey.questions
        .filter((question) => question.active)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }
  },
})

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const surveys = await ctx.db
      .query('surveys')
      .withIndex('by_featured', (q) => q.eq('featured', true))
      .take(2)
    const survey = surveys.find((item) => item.status === 'live')
    if (!survey) return null
    return {
      _id: survey._id,
      title: survey.title,
      description: survey.description,
      slug: survey.slug,
      status: survey.status,
      questions: survey.questions
        .filter((question) => question.active)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    questions: v.array(surveyQuestionValidator),
  },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx)
    validateSurveyInput(args)
    const slug = cleanSlug(args.slug)
    const existing = await ctx.db
      .query('surveys')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()
    if (existing) throw new ConvexError('That public link is already in use.')
    const now = Date.now()
    return ctx.db.insert('surveys', {
      title: args.title.trim(),
      description: args.description?.trim() || undefined,
      slug,
      status: 'draft',
      featured: false,
      questions: args.questions,
      responseCount: 0,
      createdAt: now,
      updatedAt: now,
      updatedBy: adminUser.email,
    })
  },
})

export const update = mutation({
  args: {
    surveyId: v.id('surveys'),
    title: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    questions: v.array(surveyQuestionValidator),
  },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx)
    const survey = await ctx.db.get('surveys', args.surveyId)
    if (!survey) throw new ConvexError('Survey not found.')
    validateSurveyInput(args)
    const slug = cleanSlug(args.slug)
    const existing = await ctx.db
      .query('surveys')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()
    if (existing && existing._id !== args.surveyId) {
      throw new ConvexError('That public link is already in use.')
    }
    await ctx.db.patch('surveys', args.surveyId, {
      title: args.title.trim(),
      description: args.description?.trim() || undefined,
      slug,
      questions: args.questions,
      updatedAt: Date.now(),
      updatedBy: adminUser.email,
    })
    return null
  },
})

export const setStatus = mutation({
  args: { surveyId: v.id('surveys'), status: surveyStatusValidator },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx)
    const survey = await ctx.db.get('surveys', args.surveyId)
    if (!survey) throw new ConvexError('Survey not found.')
    if (args.status === 'live' && !survey.questions.some((q) => q.active)) {
      throw new ConvexError('Add at least one question before publishing.')
    }
    await ctx.db.patch('surveys', args.surveyId, {
      status: args.status,
      featured: args.status === 'live' ? survey.featured : false,
      updatedAt: Date.now(),
      updatedBy: adminUser.email,
    })
    return null
  },
})

export const setFeatured = mutation({
  args: { surveyId: v.id('surveys'), featured: v.boolean() },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx)
    const survey = await ctx.db.get('surveys', args.surveyId)
    if (!survey) throw new ConvexError('Survey not found.')
    if (args.featured && survey.status !== 'live') {
      throw new ConvexError(
        'Only a live survey can appear on the website button.',
      )
    }
    if (args.featured) {
      const featured = await ctx.db
        .query('surveys')
        .withIndex('by_featured', (q) => q.eq('featured', true))
        .take(100)
      for (const current of featured) {
        if (current._id !== args.surveyId) {
          await ctx.db.patch('surveys', current._id, { featured: false })
        }
      }
    }
    await ctx.db.patch('surveys', args.surveyId, {
      featured: args.featured,
      updatedAt: Date.now(),
      updatedBy: adminUser.email,
    })
    return null
  },
})

export const listResponses = query({
  args: {
    surveyId: v.id('surveys'),
    paginationOpts: paginationOptsValidator,
  },
  returns: paginationResultValidator(
    v.object({
      _id: v.id('surveyResponses'),
      _creationTime: v.number(),
      surveyId: v.id('surveys'),
      answers: v.array(surveyAnswerValidator),
      submittedAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db
      .query('surveyResponses')
      .withIndex('by_surveyId', (q) => q.eq('surveyId', args.surveyId))
      .order('desc')
      .paginate(args.paginationOpts)
  },
})

export const getStats = query({
  args: { surveyId: v.id('surveys') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db
      .query('surveyAnswerStats')
      .withIndex('by_surveyId', (q) => q.eq('surveyId', args.surveyId))
      .take(250)
  },
})

export const deleteResponse = mutation({
  args: { responseId: v.id('surveyResponses') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const response = await ctx.db.get('surveyResponses', args.responseId)
    if (!response) return null
    const survey = await ctx.db.get('surveys', response.surveyId)
    await ctx.db.delete('surveyResponses', args.responseId)
    if (survey) {
      for (const answer of response.answers) {
        const valueKey = String(answer.value)
        const stat = await ctx.db
          .query('surveyAnswerStats')
          .withIndex('by_surveyId_and_questionId_and_valueKey', (q) =>
            q
              .eq('surveyId', survey._id)
              .eq('questionId', answer.questionId)
              .eq('valueKey', valueKey),
          )
          .unique()
        if (stat) {
          if (stat.count <= 1)
            await ctx.db.delete('surveyAnswerStats', stat._id)
          else
            await ctx.db.patch('surveyAnswerStats', stat._id, {
              count: stat.count - 1,
            })
        }
      }
      await ctx.db.patch('surveys', survey._id, {
        responseCount: Math.max(0, survey.responseCount - 1),
      })
    }
    return null
  },
})

export const remove = mutation({
  args: { surveyId: v.id('surveys') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const survey = await ctx.db.get('surveys', args.surveyId)
    if (!survey) return null
    await ctx.db.delete('surveys', args.surveyId)
    await ctx.scheduler.runAfter(0, internal.surveys.cleanupSurveyData, {
      surveyId: args.surveyId,
    })
    return null
  },
})

export const cleanupSurveyData = internalMutation({
  args: { surveyId: v.id('surveys') },
  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query('surveyResponses')
      .withIndex('by_surveyId', (q) => q.eq('surveyId', args.surveyId))
      .take(100)
    const limits = await ctx.db
      .query('surveyIpLimits')
      .withIndex('by_surveyId_and_ipHash', (q) =>
        q.eq('surveyId', args.surveyId),
      )
      .take(100)
    const stats = await ctx.db
      .query('surveyAnswerStats')
      .withIndex('by_surveyId', (q) => q.eq('surveyId', args.surveyId))
      .take(100)
    for (const response of responses)
      await ctx.db.delete('surveyResponses', response._id)
    for (const limit of limits) await ctx.db.delete('surveyIpLimits', limit._id)
    for (const stat of stats) await ctx.db.delete('surveyAnswerStats', stat._id)
    if (
      responses.length === 100 ||
      limits.length === 100 ||
      stats.length === 100
    ) {
      await ctx.scheduler.runAfter(0, internal.surveys.cleanupSurveyData, args)
    }
    return null
  },
})

export const submitInternal = internalMutation({
  args: {
    surveyId: v.id('surveys'),
    ipHash: v.string(),
    answers: v.array(surveyAnswerValidator),
  },
  handler: async (ctx: MutationCtx, args) => {
    const survey = await ctx.db.get('surveys', args.surveyId)
    if (!survey || survey.status !== 'live') {
      throw new ConvexError('SURVEY_NOT_LIVE')
    }
    validateAnswers(survey, args.answers)
    const limit = await ctx.db
      .query('surveyIpLimits')
      .withIndex('by_surveyId_and_ipHash', (q) =>
        q.eq('surveyId', args.surveyId).eq('ipHash', args.ipHash),
      )
      .unique()
    if (limit && limit.submissionCount >= 2) {
      throw new ConvexError('SURVEY_LIMIT_REACHED')
    }
    const now = Date.now()
    await ctx.db.insert('surveyResponses', {
      surveyId: args.surveyId,
      answers: args.answers,
      submittedAt: now,
    })
    for (const answer of args.answers) {
      const question = survey.questions.find(
        (item) => item.id === answer.questionId,
      )
      if (
        !question ||
        (question.type !== 'rating' && question.type !== 'single_choice')
      ) {
        continue
      }
      const valueKey = String(answer.value)
      const stat = await ctx.db
        .query('surveyAnswerStats')
        .withIndex('by_surveyId_and_questionId_and_valueKey', (q) =>
          q
            .eq('surveyId', survey._id)
            .eq('questionId', answer.questionId)
            .eq('valueKey', valueKey),
        )
        .unique()
      if (stat) {
        await ctx.db.patch('surveyAnswerStats', stat._id, {
          count: stat.count + 1,
        })
      } else {
        await ctx.db.insert('surveyAnswerStats', {
          surveyId: survey._id,
          questionId: answer.questionId,
          valueKey,
          count: 1,
        })
      }
    }
    if (limit) {
      await ctx.db.patch('surveyIpLimits', limit._id, {
        submissionCount: limit.submissionCount + 1,
        updatedAt: now,
      })
    } else {
      await ctx.db.insert('surveyIpLimits', {
        surveyId: args.surveyId,
        ipHash: args.ipHash,
        submissionCount: 1,
        updatedAt: now,
      })
    }
    await ctx.db.patch('surveys', survey._id, {
      responseCount: survey.responseCount + 1,
    })
    return { remaining: Math.max(0, 1 - (limit?.submissionCount ?? 0)) }
  },
})
