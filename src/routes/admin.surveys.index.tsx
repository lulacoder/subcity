import { convexQuery } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useMutation as useConvexMutation } from 'convex/react'
import { useState } from 'react'

import { api } from '../../convex/_generated/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/admin/surveys/')({
  component: SurveyAdminPage,
})

function SurveyAdminPage() {
  const session = authClient.useSession()
  const [error, setError] = useState('')
  const surveysQuery = useQuery({
    ...convexQuery(api.surveys.listAdmin, {}),
    enabled: Boolean(session.data?.user),
  })
  const setStatus = useMutation({
    mutationFn: useConvexMutation(api.surveys.setStatus),
  })
  const setFeatured = useMutation({
    mutationFn: useConvexMutation(api.surveys.setFeatured),
  })
  const removeSurvey = useMutation({
    mutationFn: useConvexMutation(api.surveys.remove),
  })

  if (session.isPending) return <SurveyAdminSkeleton />
  if (!session.data?.user) return <Navigate to="/admin/login" />
  const role = 'role' in session.data.user ? session.data.user.role : undefined
  if (role !== 'admin') {
    return (
      <main className="admin-shell grid min-h-screen place-items-center p-6">
        <Card className="max-w-md">
          <CardContent className="grid gap-4 text-center">
            <h1 className="text-xl font-semibold">Admin access required</h1>
            <p className="text-muted-foreground">
              This account cannot manage surveys.
            </p>
          </CardContent>
        </Card>
      </main>
    )
  }

  async function run(action: () => Promise<unknown>) {
    setError('')
    try {
      await action()
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : 'Action failed.',
      )
    }
  }

  const surveys = surveysQuery.data ?? []
  const liveCount = surveys.filter((survey) => survey.status === 'live').length

  return (
    <main className="survey-admin-page">
      <header className="survey-admin-topbar">
        <Link to="/admin" className="public-survey-brand">
          <span>አቃ</span>
          <strong>Admin portal</strong>
        </Link>
        <nav>
          <Link to="/admin">Directory</Link>
          <Link to="/admin/surveys" className="active">
            Surveys
          </Link>
        </nav>
      </header>

      <section className="survey-admin-content">
        <div className="admin-main-header">
          <div>
            <p className="admin-overline">Public feedback</p>
            <h1>Surveys</h1>
            <p>
              Create public surveys, choose the one shown on the website, and
              review anonymous responses.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link to="/admin/surveys/$id" params={{ id: 'new' }} />}
          >
            Create survey
          </Button>
        </div>

        <div className="admin-stats survey-admin-stats">
          <div className="admin-stat-card">
            <span>Total surveys</span>
            <strong>{surveys.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Live surveys</span>
            <strong>{liveCount}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Total responses</span>
            <strong>
              {surveys.reduce((sum, survey) => sum + survey.responseCount, 0)}
            </strong>
          </div>
        </div>

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}
        {surveysQuery.isPending ? (
          <div className="grid gap-3">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : surveysQuery.error ? (
          <div className="admin-error" role="alert">
            {surveysQuery.error.message}
          </div>
        ) : surveys.length === 0 ? (
          <div className="survey-empty-state">
            <h2>No surveys yet</h2>
            <p>
              Create a draft, add questions, then publish it when it is ready.
            </p>
            <Button
              nativeButton={false}
              render={<Link to="/admin/surveys/$id" params={{ id: 'new' }} />}
            >
              Create the first survey
            </Button>
          </div>
        ) : (
          <div className="survey-admin-list">
            {surveys.map((survey) => (
              <article key={survey._id} className="survey-admin-card">
                <div>
                  <div className="survey-card-title">
                    <h2>{survey.title}</h2>
                    <Badge
                      variant={
                        survey.status === 'live' ? 'default' : 'secondary'
                      }
                    >
                      {survey.status}
                    </Badge>
                    {survey.featured && (
                      <Badge variant="outline">Website button</Badge>
                    )}
                  </div>
                  <p>/{survey.slug}</p>
                  <small>
                    {survey.responseCount} responses ·{' '}
                    {
                      survey.questions.filter((question) => question.active)
                        .length
                    }{' '}
                    questions
                  </small>
                </div>
                <div className="survey-card-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={
                      <Link
                        to="/surveys/$slug"
                        params={{ slug: survey.slug }}
                        target="_blank"
                      />
                    }
                  >
                    Open link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={
                      <Link
                        to="/admin/surveys/$id"
                        params={{ id: survey._id }}
                      />
                    }
                  >
                    Edit and results
                  </Button>
                  {survey.status !== 'live' ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        void run(() =>
                          setStatus.mutateAsync({
                            surveyId: survey._id,
                            status: 'live',
                          }),
                        )
                      }
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void run(() =>
                          setStatus.mutateAsync({
                            surveyId: survey._id,
                            status: 'closed',
                          }),
                        )
                      }
                    >
                      Close
                    </Button>
                  )}
                  {survey.status === 'live' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void run(() =>
                          setFeatured.mutateAsync({
                            surveyId: survey._id,
                            featured: !survey.featured,
                          }),
                        )
                      }
                    >
                      {survey.featured
                        ? 'Remove from website'
                        : 'Show on website'}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete "${survey.title}" and all of its responses? This cannot be undone.`,
                        )
                      ) {
                        void run(() =>
                          removeSurvey.mutateAsync({ surveyId: survey._id }),
                        )
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function SurveyAdminSkeleton() {
  return (
    <main className="grid min-h-screen place-items-center">
      <Skeleton className="h-12 w-52 rounded-xl" />
    </main>
  )
}
