import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { prosperityContent } from '@/lib/prosperity-content'
import type { Language } from '@/lib/landing-content'
import '@/prosperity-overview.css'

export function ProsperityOverview({ language }: { language: Language }) {
  const content = prosperityContent[language]

  return (
    <section className="prosperity-overview" lang={language}>
      <div className="civic-shell">
        <header className="prosperity-intro">
          <p className="civic-section-kicker">{content.eyebrow}</p>
          <h2 className="civic-section-heading">{content.title}</h2>
          <p>{content.intro}</p>
        </header>

        <div className="prosperity-photo-grid" aria-label={content.eyebrow}>
          <figure>
            <img
              src="/images/prosperity-event-1.jpeg"
              alt={content.photoAltOne}
              loading="lazy"
            />
          </figure>
          <figure className="prosperity-photo-featured">
            <img
              src="/images/prosperity-event-2.jpg"
              alt={content.photoAltTwo}
              loading="lazy"
            />
          </figure>
        </div>

        <div className="prosperity-vision" id="vision">
          <div className="prosperity-section-heading">
            <div>
              <p className="civic-section-kicker">{content.visionLabel}</p>
              <h2>{content.visionTitle}</h2>
            </div>
            <p>{content.visionIntro}</p>
          </div>

          <div className="prosperity-timeline">
            {content.milestones.map((milestone, index) => (
              <article key={milestone.year} className="prosperity-milestone">
                <span className="prosperity-milestone-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong>{milestone.year}</strong>
                <p>{milestone.text}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="prosperity-goal">
          <span>{content.goalLabel}</span>
          <div>
            <h3>{content.goalTitle}</h3>
            <p>{content.goalBody}</p>
          </div>
        </aside>

        <div className="prosperity-values" id="values">
          <div className="prosperity-section-heading">
            <div>
              <p className="civic-section-kicker">{content.valuesLabel}</p>
              <h2>{content.valuesTitle}</h2>
            </div>
            <p>{content.valuesIntro}</p>
          </div>

          <div className="prosperity-values-grid">
            {content.values.map((value, index) => (
              <details key={value.title} className="prosperity-value-card">
                <summary>
                  <span className="prosperity-value-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="prosperity-value-title">{value.title}</span>
                  <HugeiconsIcon
                    className="prosperity-value-chevron"
                    icon={ArrowDown01Icon}
                    size={18}
                  />
                </summary>
                <p>{value.body}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="prosperity-objectives">
          <div className="prosperity-section-heading">
            <div>
              <p className="civic-section-kicker">{content.objectivesLabel}</p>
              <h2>{content.objectivesTitle}</h2>
            </div>
            <p>{content.objectivesIntro}</p>
          </div>

          <div className="prosperity-objectives-grid">
            {content.objectives.map((objective, index) => (
              <article key={objective.title} className="prosperity-objective-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{objective.title}</h3>
                <p>{objective.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
