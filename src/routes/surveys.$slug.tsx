import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { SurveyForm } from '@/components/survey-form'
import type { Language } from '@/lib/landing-content'
import { fetchPublicSurvey } from '@/lib/surveys'

export const Route = createFileRoute('/surveys/$slug')({
  component: PublicSurveyPage,
})

function PublicSurveyPage() {
  const { slug } = Route.useParams()
  const [language, setLanguage] = useState<Language>('en')
  const surveyQuery = useQuery({
    queryKey: ['public-survey', slug],
    queryFn: () => fetchPublicSurvey(slug),
  })
  const survey = surveyQuery.data

  return (
    <main className="public-survey-page">
      <Link to="/" className="public-survey-brand">
        <span>አቃ</span>
        <strong>Akaki Kality</strong>
      </Link>
      <label className="public-survey-language">
        <span className="sr-only">Interface language</span>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as Language)}
        >
          <option value="am">አማርኛ</option>
          <option value="om">Afaan Oromoo</option>
          <option value="en">English</option>
        </select>
      </label>
      <section className="public-survey-card">
        {surveyQuery.isPending ? (
          <p>Loading survey...</p>
        ) : surveyQuery.error ? (
          <div className="survey-unavailable">
            <h1>Survey could not load</h1>
            <p>{surveyQuery.error.message}</p>
          </div>
        ) : !survey || survey.status !== 'live' ? (
          <div className="survey-unavailable">
            <h1>Survey unavailable</h1>
            <p>This survey is not accepting responses.</p>
            <Link to="/">Return to the website</Link>
          </div>
        ) : (
          <SurveyForm survey={survey} language={language} />
        )}
      </section>
    </main>
  )
}
