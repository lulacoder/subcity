import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from '@tanstack/react-router'
import {
  useMutation as useConvexMutation,
  usePaginatedQuery,
} from 'convex/react'
import { useEffect, useMemo, useState } from 'react'

import { api } from '../../convex/_generated/api'
import type { Doc, Id } from '../../convex/_generated/dataModel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'
import { newQuestion, slugifySurveyTitle } from '@/lib/surveys'
import type { SurveyQuestion } from '@/lib/surveys'

export const Route = createFileRoute('/admin/surveys/$id')({
  component: SurveyEditorPage,
})

function SurveyEditorPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const surveyId = id as Id<'surveys'>
  const session = authClient.useSession()
  const surveyQuery = useQuery({
    ...convexQuery(api.surveys.getAdmin, isNew ? 'skip' : { surveyId }),
    enabled: Boolean(session.data?.user) && !isNew,
  })
  const statsQuery = useQuery({
    ...convexQuery(api.surveys.getStats, isNew ? 'skip' : { surveyId }),
    enabled: Boolean(session.data?.user) && !isNew,
  })
  const responses = usePaginatedQuery(
    api.surveys.listResponses,
    session.data?.user && !isNew ? { surveyId } : 'skip',
    { initialNumItems: 100 },
  )
  const createSurvey = useConvexMutation(api.surveys.create)
  const updateSurvey = useConvexMutation(api.surveys.update)
  const deleteResponse = useConvexMutation(api.surveys.deleteResponse)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [questions, setQuestions] = useState<Array<SurveyQuestion>>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const survey = surveyQuery.data
    if (!survey) return
    setTitle(survey.title)
    setDescription(survey.description ?? '')
    setSlug(survey.slug)
    setSlugEdited(true)
    setQuestions(
      [...survey.questions].sort((a, b) => a.displayOrder - b.displayOrder),
    )
  }, [surveyQuery.data])

  const activeQuestions = questions.filter((question) => question.active)

  function updateQuestion(questionId: string, patch: Partial<SurveyQuestion>) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    )
    setSaved(false)
  }

  function addQuestion() {
    if (activeQuestions.length >= 20) return
    const question = newQuestion()
    question.displayOrder = activeQuestions.length
    setQuestions((current) => [...current, question])
    setSaved(false)
  }

  function moveQuestion(questionId: string, direction: -1 | 1) {
    const ordered = [...activeQuestions].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    )
    const index = ordered.findIndex((question) => question.id === questionId)
    const swap = index + direction
    if (index < 0 || swap < 0 || swap >= ordered.length) return
    const next = [...ordered]
    ;[next[index], next[swap]] = [next[swap], next[index]]
    const orderMap = new Map(
      next.map((question, position) => [question.id, position]),
    )
    setQuestions((current) =>
      current.map((question) =>
        orderMap.has(question.id)
          ? { ...question, displayOrder: orderMap.get(question.id)! }
          : question,
      ),
    )
    setSaved(false)
  }

  async function save() {
    setError('')
    setSaving(true)
    try {
      const values = {
        title,
        description: description || undefined,
        slug,
        questions,
      }
      if (isNew) {
        const createdId = await createSurvey(values)
        await navigate({ to: '/admin/surveys/$id', params: { id: createdId } })
      } else {
        await updateSurvey({ surveyId, ...values })
        setSaved(true)
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Could not save the survey.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (session.isPending)
    return (
      <main className="grid min-h-screen place-items-center">
        <Skeleton className="h-12 w-52 rounded-xl" />
      </main>
    )
  if (!session.data?.user) return <Navigate to="/admin/login" />
  const role = 'role' in session.data.user ? session.data.user.role : undefined
  if (role !== 'admin') return <Navigate to="/admin" />
  if (!isNew && surveyQuery.isPending)
    return (
      <main className="grid min-h-screen place-items-center">
        <Skeleton className="h-12 w-52 rounded-xl" />
      </main>
    )
  if (!isNew && !surveyQuery.data) {
    return (
      <main className="public-survey-page">
        <div className="survey-unavailable">
          <h1>Survey not found</h1>
          <Link to="/admin/surveys">Return to surveys</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="survey-editor-page">
      <header className="survey-editor-header">
        <div>
          <Link to="/admin/surveys">← Surveys</Link>
          <h1>{isNew ? 'Create survey' : surveyQuery.data?.title}</h1>
        </div>
        <div>
          {!isNew && <Badge>{surveyQuery.data?.status}</Badge>}
          {saved && <span className="survey-saved">Saved</span>}
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? 'Saving...' : 'Save survey'}
          </Button>
        </div>
      </header>

      <div className="survey-editor-grid">
        <section className="survey-builder-card">
          <h2>Survey details</h2>
          <label>
            Title
            <Input
              value={title}
              maxLength={120}
              onChange={(event) => {
                const value = event.target.value
                setTitle(value)
                if (!slugEdited) setSlug(slugifySurveyTitle(value))
                setSaved(false)
              }}
            />
          </label>
          <label>
            Description
            <textarea
              className="survey-textarea"
              value={description}
              maxLength={500}
              rows={3}
              onChange={(event) => {
                setDescription(event.target.value)
                setSaved(false)
              }}
            />
          </label>
          <label>
            Public link
            <div className="survey-slug-input">
              <span>/surveys/</span>
              <Input
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value.toLowerCase())
                  setSlugEdited(true)
                  setSaved(false)
                }}
              />
            </div>
          </label>
        </section>

        <section className="survey-builder-card survey-builder-questions">
          <div className="survey-builder-heading">
            <div>
              <h2>Questions</h2>
              <p>{activeQuestions.length} of 20 questions</p>
            </div>
            <Button
              variant="outline"
              onClick={addQuestion}
              disabled={activeQuestions.length >= 20}
            >
              Add question
            </Button>
          </div>
          {activeQuestions.length === 0 && (
            <div className="survey-question-empty">
              Add the first question to begin.
            </div>
          )}
          {activeQuestions
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((question, index) => (
              <article className="survey-builder-question" key={question.id}>
                <div className="survey-builder-question-top">
                  <strong>Question {index + 1}</strong>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveQuestion(question.id, -1)}
                      disabled={index === 0}
                    >
                      Up
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveQuestion(question.id, 1)}
                      disabled={index === activeQuestions.length - 1}
                    >
                      Down
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateQuestion(question.id, { active: false })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <Input
                  placeholder="Write the question"
                  value={question.prompt}
                  maxLength={300}
                  onChange={(event) =>
                    updateQuestion(question.id, { prompt: event.target.value })
                  }
                />
                <div className="survey-question-settings">
                  <label>
                    Answer type
                    <select
                      value={question.type}
                      onChange={(event) => {
                        const type = event.target
                          .value as SurveyQuestion['type']
                        updateQuestion(question.id, {
                          type,
                          options:
                            type === 'single_choice' &&
                            question.options.length < 2
                              ? newQuestion('single_choice').options
                              : question.options,
                        })
                      }}
                    >
                      <option value="short_text">Short text</option>
                      <option value="long_text">Long text</option>
                      <option value="single_choice">One choice</option>
                      <option value="rating">Rating 1 to 5</option>
                    </select>
                  </label>
                  <label className="survey-required-toggle">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(event) =>
                        updateQuestion(question.id, {
                          required: event.target.checked,
                        })
                      }
                    />{' '}
                    Required
                  </label>
                </div>
                {question.type === 'single_choice' && (
                  <div className="survey-option-editor">
                    {question.options.map((option, optionIndex) => (
                      <div key={option.id}>
                        <span>{optionIndex + 1}</span>
                        <Input
                          value={option.label}
                          placeholder={`Choice ${optionIndex + 1}`}
                          maxLength={120}
                          onChange={(event) =>
                            updateQuestion(question.id, {
                              options: question.options.map((item) =>
                                item.id === option.id
                                  ? { ...item, label: event.target.value }
                                  : item,
                              ),
                            })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={question.options.length <= 2}
                          onClick={() =>
                            updateQuestion(question.id, {
                              options: question.options.filter(
                                (item) => item.id !== option.id,
                              ),
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={question.options.length >= 10}
                      onClick={() =>
                        updateQuestion(question.id, {
                          options: [
                            ...question.options,
                            { id: crypto.randomUUID(), label: '' },
                          ],
                        })
                      }
                    >
                      Add choice
                    </Button>
                  </div>
                )}
              </article>
            ))}
          {error && (
            <div className="admin-error" role="alert">
              {error}
            </div>
          )}
        </section>

        {!isNew && surveyQuery.data && (
          <SurveyResults
            survey={surveyQuery.data}
            stats={statsQuery.data ?? []}
            responses={responses.results}
            responseStatus={responses.status}
            loadMore={() => responses.loadMore(100)}
            onDelete={async (responseId) => {
              await deleteResponse({ responseId })
            }}
          />
        )}
      </div>
    </main>
  )
}

type SurveyResultsProps = {
  survey: Doc<'surveys'>
  stats: Array<{ questionId: string; valueKey: string; count: number }>
  responses: Array<{
    _id: Id<'surveyResponses'>
    submittedAt: number
    answers: Array<{ questionId: string; value: string | number }>
  }>
  responseStatus: string
  loadMore: () => void
  onDelete: (responseId: Id<'surveyResponses'>) => Promise<void>
}

function SurveyResults({
  survey,
  stats,
  responses,
  responseStatus,
  loadMore,
  onDelete,
}: SurveyResultsProps) {
  const questionMap = useMemo(
    () => new Map(survey.questions.map((question) => [question.id, question])),
    [survey.questions],
  )

  function answerLabel(questionId: string, value: string | number) {
    const question = questionMap.get(questionId)
    if (!question) return String(value)
    if (question.type === 'single_choice')
      return (
        question.options.find((option) => option.id === value)?.label ??
        'Removed choice'
      )
    return String(value)
  }

  function downloadCsv() {
    const header = [
      'Submitted at',
      ...survey.questions.map((question) => question.prompt),
    ]
    const rows = responses.map((response) => {
      const answers = new Map(
        response.answers.map((answer) => [answer.questionId, answer.value]),
      )
      return [
        new Date(response.submittedAt).toISOString(),
        ...survey.questions.map((question) => {
          const value = answers.get(question.id)
          return value === undefined ? '' : answerLabel(question.id, value)
        }),
      ]
    })
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escape(String(cell))).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `${survey.slug}-responses.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="survey-builder-card survey-results-card">
      <div className="survey-builder-heading">
        <div>
          <h2>Results</h2>
          <p>{survey.responseCount} saved responses</p>
        </div>
        {responseStatus !== 'Exhausted' ? (
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={responseStatus === 'LoadingMore'}
          >
            {responseStatus === 'LoadingMore'
              ? 'Loading...'
              : 'Load more for CSV'}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={downloadCsv}
            disabled={responses.length === 0}
          >
            Download CSV
          </Button>
        )}
      </div>

      <div className="survey-result-summaries">
        {survey.questions
          .filter(
            (question) =>
              question.type === 'rating' || question.type === 'single_choice',
          )
          .map((question) => {
            const questionStats = stats.filter(
              (stat) => stat.questionId === question.id,
            )
            const total = questionStats.reduce(
              (sum, stat) => sum + stat.count,
              0,
            )
            return (
              <article key={question.id}>
                <h3>{question.prompt}</h3>
                {question.type === 'rating' ? (
                  <div className="rating-summary">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <span key={rating}>
                        <strong>
                          {questionStats.find(
                            (stat) => stat.valueKey === String(rating),
                          )?.count ?? 0}
                        </strong>
                        <small>{rating} star</small>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="choice-summary">
                    {question.options.map((option) => {
                      const count =
                        questionStats.find(
                          (stat) => stat.valueKey === option.id,
                        )?.count ?? 0
                      return (
                        <div key={option.id}>
                          <span>{option.label}</span>
                          <strong>
                            {count}{' '}
                            {total
                              ? `(${Math.round((count / total) * 100)}%)`
                              : ''}
                          </strong>
                        </div>
                      )
                    })}
                  </div>
                )}
              </article>
            )
          })}
      </div>

      <div className="survey-response-list">
        {responses.map((response) => (
          <article key={response._id}>
            <header>
              <time>{new Date(response.submittedAt).toLocaleString()}</time>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (
                    window.confirm(
                      'Delete this response? Its network will not regain a submission slot.',
                    )
                  )
                    void onDelete(response._id)
                }}
              >
                Delete response
              </Button>
            </header>
            <dl>
              {response.answers.map((answer) => (
                <div key={answer.questionId}>
                  <dt>
                    {questionMap.get(answer.questionId)?.prompt ??
                      'Removed question'}
                  </dt>
                  <dd>{answerLabel(answer.questionId, answer.value)}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
        {responses.length === 0 && (
          <p className="survey-question-empty">No responses yet.</p>
        )}
      </div>
    </section>
  )
}
