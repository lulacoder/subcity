import { useState } from 'react'

import type { Language } from '@/lib/landing-content'
import { surveyCopy } from '@/lib/surveys'
import type { PublicSurvey } from '@/lib/surveys'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SurveyFormProps = {
  survey: PublicSurvey
  language?: Language
  onSubmitted?: () => void
}

export function SurveyForm({
  survey,
  language = 'en',
  onSubmitted,
}: SurveyFormProps) {
  const copy = surveyCopy[language]
  const [answers, setAnswers] = useState<
    Partial<Record<string, string | number>>
  >({})
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function setAnswer(questionId: string, value: string | number) {
    setAnswers((current) => ({ ...current, [questionId]: value }))
    setError('')
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/survey-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey._id,
          answers: survey.questions.flatMap((question) => {
            const value = answers[question.id]
            return value === undefined || value === ''
              ? []
              : [{ questionId: question.id, value }]
          }),
        }),
      })
      const result = (await response.json().catch(() => ({
        error: 'The submission service is unavailable.',
      }))) as {
        remaining?: number
        error?: string
      }
      if (!response.ok) throw new Error(result.error || 'Submission failed.')
      setRemaining(result.remaining ?? 0)
      onSubmitted?.()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Submission failed.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (remaining !== null) {
    return (
      <div className="survey-success" role="status">
        <span aria-hidden="true">✓</span>
        <h2>{copy.thankYou}</h2>
        <p>{remaining > 0 ? copy.oneLeft : copy.noneLeft}</p>
      </div>
    )
  }

  return (
    <form className="survey-form" onSubmit={submit}>
      <div className="survey-form-heading">
        <h2>{survey.title}</h2>
        {survey.description && <p>{survey.description}</p>}
        <small>{copy.networkNote}</small>
      </div>

      <div className="survey-question-list">
        {survey.questions.map((question, index) => (
          <fieldset className="survey-question" key={question.id}>
            <legend>
              <span>{index + 1}.</span> {question.prompt}
              {question.required && <em>{copy.required}</em>}
            </legend>

            {question.type === 'short_text' && (
              <Input
                value={String(answers[question.id] ?? '')}
                onChange={(event) => setAnswer(question.id, event.target.value)}
                maxLength={200}
                required={question.required}
              />
            )}

            {question.type === 'long_text' && (
              <textarea
                className="survey-textarea"
                value={String(answers[question.id] ?? '')}
                onChange={(event) => setAnswer(question.id, event.target.value)}
                maxLength={2000}
                rows={4}
                required={question.required}
              />
            )}

            {question.type === 'single_choice' && (
              <div className="survey-options">
                {question.options.map((option) => (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => setAnswer(question.id, option.id)}
                      required={question.required}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'rating' && (
              <div className="survey-rating" aria-label="Rating from 1 to 5">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating}>
                    <input
                      type="radio"
                      name={question.id}
                      value={rating}
                      checked={answers[question.id] === rating}
                      onChange={() => setAnswer(question.id, rating)}
                      required={question.required}
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        ))}
      </div>

      {error && (
        <div className="survey-submit-error" role="alert">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={submitting}
        className="survey-submit-button"
      >
        {submitting ? copy.submitting : copy.submit}
      </Button>
    </form>
  )
}
