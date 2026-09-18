import { useState } from 'react'

import { LEADERSHIP_IMAGE_URLS } from '@/lib/brand'
import { leadershipProfiles } from '@/lib/leadership-content'
import type { Language } from '@/lib/landing-content'
import '@/leadership-section.css'

const leadershipCopy: Record<
  Language,
  { eyebrow: string; title: string; intro: string; messageLabel: string }
> = {
  am: {
    eyebrow: 'አመራር',
    title: 'የአቃቂ ቃሊቲ አመራር',
    intro: 'የክፍለ ከተማው አመራሮች ሙሉ መልዕክት።',
    messageLabel: 'የአመራር መልዕክት',
  },
  om: {
    eyebrow: 'Hoggansa',
    title: 'Hoggansa Aqaaqii Qaallittii',
    intro: 'Ergaa guutuu hoggantoota kutaa magaalichaa.',
    messageLabel: 'Ergaa hoggansa',
  },
  en: {
    eyebrow: 'Leadership',
    title: 'Akaki Kality leadership',
    intro: 'The complete messages from the party leaders.',
    messageLabel: 'Leadership message',
  },
}

function LeadershipPortrait({
  src,
  alt,
  index,
}: {
  src: string
  alt: string
  index: number
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className="leadership-portrait"
      role="img"
      aria-label={alt}
      data-missing={failed || undefined}
    >
      {!failed && (
        <img src={src} alt="" onError={() => setFailed(true)} loading="lazy" />
      )}
      <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    </div>
  )
}

export function LeadershipSection({ language }: { language: Language }) {
  const copy = leadershipCopy[language]
  const profiles = leadershipProfiles[language]

  return (
    <section className="leadership-section" id="leadership" lang={language}>
      <div className="civic-shell leadership-layout">
        <header className="leadership-heading">
          <p className="civic-section-kicker">{copy.eyebrow}</p>
          <h2 className="civic-section-heading">{copy.title}</h2>
          <p>{copy.intro}</p>
        </header>

        <div className="leadership-profiles">
          {profiles.map((profile, index) => (
            <article className="leadership-profile" key={profile.name}>
              <div className="leadership-profile-identity">
                <LeadershipPortrait
                  src={LEADERSHIP_IMAGE_URLS[index]}
                  alt={profile.name}
                  index={index}
                />
                <p className="leadership-profile-number">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>

              <div className="leadership-profile-copy">
                <p className="leadership-message-label">{copy.messageLabel}</p>
                <h3>{profile.name}</h3>
                <p className="leadership-role">{profile.role}</p>
                <div className="leadership-message">
                  <h4>{profile.title}</h4>
                  {profile.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
