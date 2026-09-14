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

export const surveyStatusValidator = v.union(
  v.literal('draft'),
  v.literal('live'),
  v.literal('closed'),
)

export const surveyQuestionTypeValidator = v.union(
  v.literal('short_text'),
  v.literal('long_text'),
  v.literal('single_choice'),
  v.literal('rating'),
)

export const surveyQuestionValidator = v.object({
  id: v.string(),
  type: surveyQuestionTypeValidator,
  prompt: v.string(),
  required: v.boolean(),
  active: v.boolean(),
  displayOrder: v.number(),
  options: v.array(
    v.object({
      id: v.string(),
      label: v.string(),
    }),
  ),
})

export const surveyAnswerValidator = v.object({
  questionId: v.string(),
  value: v.union(v.string(), v.number()),
})

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
  surveys: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    status: surveyStatusValidator,
    featured: v.boolean(),
    questions: v.array(surveyQuestionValidator),
    responseCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    updatedBy: v.string(),
  })
    .index('by_slug', ['slug'])
    .index('by_featured', ['featured'])
    .index('by_status', ['status']),
  surveyResponses: defineTable({
    surveyId: v.id('surveys'),
    answers: v.array(surveyAnswerValidator),
    submittedAt: v.number(),
  }).index('by_surveyId', ['surveyId']),
  surveyIpLimits: defineTable({
    surveyId: v.id('surveys'),
    ipHash: v.string(),
    submissionCount: v.number(),
    updatedAt: v.number(),
  }).index('by_surveyId_and_ipHash', ['surveyId', 'ipHash']),
  surveyAnswerStats: defineTable({
    surveyId: v.id('surveys'),
    questionId: v.string(),
    valueKey: v.string(),
    count: v.number(),
  })
    .index('by_surveyId', ['surveyId'])
    .index('by_surveyId_and_questionId_and_valueKey', [
      'surveyId',
      'questionId',
      'valueKey',
    ]),
})
