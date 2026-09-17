import { prosperityContent } from '@/lib/prosperity-content'
import type { Language } from '@/lib/landing-content'
import '@/prosperity-party-section.css'

export function ProsperityPartyIntro({ language }: { language: Language }) {
  const content = prosperityContent[language]

  return (
    <section
      className="civic-party-intro"
      lang={language}
      aria-labelledby="prosperity-party-title"
    >
      <div className="civic-shell">
        <div className="civic-party-intro-heading">
          <div>
            <p className="civic-section-kicker">{content.eyebrow}</p>
            <h2 id="prosperity-party-title" className="civic-section-heading">
              {content.title}
            </h2>
          </div>
          <p>{content.intro}</p>
        </div>

        <div className="civic-party-photo-grid">
          <figure>
            <img
              src="/images/prosperity-gathering-1.jpg"
              alt={content.imageAltOne}
              loading="lazy"
            />
          </figure>
          <figure>
            <img
              src="/images/prosperity-gathering-2.jpg"
              alt={content.imageAltTwo}
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}

export function ProsperityPartyDetails({ language }: { language: Language }) {
  const content = prosperityContent[language]

  return (
    <div className="civic-party-details" lang={language}>
      <section className="civic-party-vision" id="vision">
        <div className="civic-shell">
          <div className="civic-party-section-heading">
            <p className="civic-section-kicker">{content.visionLabel}</p>
            <h2 className="civic-section-heading">{content.visionTitle}</h2>
          </div>

          <div className="civic-party-timeline">
            {content.visionMilestones.map((milestone, index) => (
              <article key={milestone.year} className="civic-party-milestone">
                <span className="civic-party-milestone-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong>{milestone.year}</strong>
                <p>{milestone.text}</p>
              </article>
            ))}
          </div>

          <div className="civic-party-goal">
            <span>{content.overallGoalLabel}</span>
            <strong>{content.overallGoal}</strong>
          </div>
        </div>
      </section>

      <section className="civic-party-values" id="values">
        <div className="civic-shell">
          <div className="civic-party-section-heading">
            <p className="civic-section-kicker">{content.valuesLabel}</p>
            <h2 className="civic-section-heading">{content.valuesTitle}</h2>
          </div>

          <div className="civic-party-values-grid">
            {content.values.map((value, index) => (
              <article key={value.title} className="civic-party-value-card">
                <span className="civic-party-value-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="civic-party-objectives">
        <div className="civic-shell">
          <div className="civic-party-section-heading">
            <p className="civic-section-kicker">{content.objectivesLabel}</p>
            <h2 className="civic-section-heading">{content.objectivesTitle}</h2>
          </div>

          <div className="civic-party-objective-grid">
            {content.objectives.map((objective, index) => (
              <article key={objective} className="civic-party-objective-card">
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p>{objective}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
