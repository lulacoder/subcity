import type { Doc } from '../../convex/_generated/dataModel'
import type { Language } from './landing-content'

export type SurveyQuestion = Doc<'surveys'>['questions'][number]
export type PublicSurvey = Pick<
  Doc<'surveys'>,
  '_id' | 'title' | 'description' | 'slug' | 'status'
> & { questions: Array<SurveyQuestion> }

export const surveyCopy = {
  am: {
    button: 'አስተያየት ይስጡ',
    close: 'ዝጋ',
    submit: 'ላክ',
    submitting: 'በመላክ ላይ...',
    required: 'አስፈላጊ',
    thankYou: 'እናመሰግናለን። አስተያየትዎ ተቀብሏል።',
    oneLeft: 'ይህ ኔትወርክ አንድ ተጨማሪ ምላሽ መላክ ይችላል።',
    noneLeft: 'ይህ ኔትወርክ የሁለት ምላሽ ገደቡ ላይ ደርሷል።',
    unavailable: 'ይህ የዳሰሳ ጥናት በአሁኑ ጊዜ ምላሽ አይቀበልም።',
    networkNote: 'በእያንዳንዱ ዳሰሳ ጥናት ከአንድ ኔትወርክ እስከ ሁለት ምላሾች።',
  },
  om: {
    button: 'Yaada kenni',
    close: 'Cufi',
    submit: 'Ergi',
    submitting: 'Ergaa jira...',
    required: 'Dirqama',
    thankYou: 'Galatoomi. Yaadni kee fudhatameera.',
    oneLeft: 'Neetworkiin kun deebii dabalataa tokko erguu danda’a.',
    noneLeft: 'Neetworkiin kun daangaa deebii lamaa irra gaheera.',
    unavailable: 'Qorannoon kun yeroo ammaa deebii hin fudhatu.',
    networkNote: 'Qorannoo tokkoof neetworkii tokko irraa deebii lama hanga.',
  },
  en: {
    button: 'Share feedback',
    close: 'Close',
    submit: 'Submit feedback',
    submitting: 'Submitting...',
    required: 'Required',
    thankYou: 'Thank you. Your feedback has been received.',
    oneLeft: 'This network can submit one more response.',
    noneLeft: 'This network has reached the two-response limit.',
    unavailable: 'This survey is not accepting responses.',
    networkNote: 'Up to two responses from one network for each survey.',
  },
} satisfies Record<Language, Record<string, string>>

export function slugifySurveyTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export function newQuestion(
  type: SurveyQuestion['type'] = 'short_text',
): SurveyQuestion {
  const id = crypto.randomUUID()
  return {
    id,
    type,
    prompt: '',
    required: false,
    active: true,
    displayOrder: 0,
    options:
      type === 'single_choice'
        ? [
            { id: crypto.randomUUID(), label: '' },
            { id: crypto.randomUUID(), label: '' },
          ]
        : [],
  }
}

const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL

export async function fetchPublicSurvey(slug: string) {
  if (!convexSiteUrl) throw new Error('VITE_CONVEX_SITE_URL is not set.')
  const response = await fetch(
    `${convexSiteUrl}/survey-public?slug=${encodeURIComponent(slug)}`,
  )
  if (!response.ok) throw new Error('Could not load the survey.')
  return (await response.json()) as PublicSurvey | null
}

export async function fetchFeaturedSurvey() {
  if (!convexSiteUrl) throw new Error('VITE_CONVEX_SITE_URL is not set.')
  const response = await fetch(`${convexSiteUrl}/survey-featured`)
  if (!response.ok) throw new Error('Could not load the featured survey.')
  return (await response.json()) as PublicSurvey | null
}
