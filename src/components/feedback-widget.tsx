import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import type { Language } from '@/lib/landing-content'
import { fetchFeaturedSurvey, surveyCopy } from '@/lib/surveys'
import { SurveyForm } from '@/components/survey-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

export function FeedbackWidget({ language }: { language: Language }) {
  const [open, setOpen] = useState(false)
  const surveyQuery = useQuery({
    queryKey: ['featured-survey'],
    queryFn: fetchFeaturedSurvey,
  })
  const survey = surveyQuery.data
  if (!survey) return null

  return (
    <>
      <Button className="feedback-fab" onClick={() => setOpen(true)}>
        <span aria-hidden="true">✦</span>
        {surveyCopy[language].button}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="survey-panel"
          aria-describedby="survey-panel-description"
        >
          <DialogTitle className="sr-only">{survey.title}</DialogTitle>
          <DialogDescription id="survey-panel-description" className="sr-only">
            {survey.description ?? surveyCopy[language].networkNote}
          </DialogDescription>
          <SurveyForm survey={survey} language={language} />
        </DialogContent>
      </Dialog>
    </>
  )
}
