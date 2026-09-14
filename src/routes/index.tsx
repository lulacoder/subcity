import {
  ArrowDown02Icon,
  ArrowRight02Icon,
  LockPasswordIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { FeedbackWidget } from '@/components/feedback-widget'
import { galleryImages, landingCopy } from '@/lib/landing-content'
import type { Language } from '@/lib/landing-content'

export const Route = createFileRoute('/')({ component: Home })

const languageList: Array<{
  key: Language
  label: string
  native: string
  flag: string
}> = [
  { key: 'am', label: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
  { key: 'om', label: 'Afaan Oromoo', native: 'Afaan Oromoo', flag: '🇪🇹' },
  { key: 'en', label: 'English', native: 'English', flag: '🌐' },
]

const metricLabels: Record<
  Language,
  {
    stat1: string
    label1: string
    stat2: string
    label2: string
    stat3: string
    label3: string
  }
> = {
  am: {
    stat1: '15+',
    label1: 'የክፍለ ከተማው ወረዳዎች',
    stat2: '54 ኪ.ሜ²',
    label2: 'የመሬት ስፋት',
    stat3: '100%',
    label3: 'የተረጋገጡ የህዝብ አድራሻዎች',
  },
  om: {
    stat1: '15+',
    label1: 'Aanoolee Kutaa Magaalaa',
    stat2: '54 km²',
    label2: "Bal'ina Lafa",
    stat3: '100%',
    label3: "Teessoowwan Mirkanaa'an",
  },
  en: {
    stat1: '15+',
    label1: 'Administrative Woredas',
    stat2: '54 km²',
    label2: 'Total Territory',
    stat3: '100%',
    label3: 'Verified Civic Channels',
  },
}

function Home() {
  const [language, setLanguage] = useState<Language>('am')
  const copy = landingCopy[language]
  const metrics = metricLabels[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <main className="landing-page" id="home">
      {/* Floating Glass Capsule Navigation */}
      <header className="landing-header">
        <a className="wordmark" href="#home" aria-label={copy.nav.home}>
          <span className="wordmark-mark">አቃ</span>
          <span>{copy.title}</span>
        </a>

        <nav className="landing-nav" aria-label="Primary navigation">
          <a href="#about">{copy.nav.home}</a>
          <a href="#vision">{copy.nav.vision}</a>
          <a href="#values">{copy.nav.values}</a>
          <a href="#gallery">{copy.nav.gallery}</a>
        </nav>

        <label className="language-select-wrap">
          <span className="sr-only">Select language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            className="language-select"
            aria-label="Select language"
          >
            {languageList.map((item) => (
              <option key={item.key} value={item.key}>
                {item.native}
              </option>
            ))}
          </select>
        </label>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-copy" lang={language}>
          <div className="eyebrow">
            <span className="live-dot" />
            <span>{copy.eyebrow}</span>
          </div>

          <h1>{copy.title}</h1>
          <p className="hero-lead">{copy.lead}</p>

          <div className="hero-actions">
            <Button
              render={<a href="#about" />}
              nativeButton={false}
              className="hero-button"
              size="lg"
            >
              <span>{copy.explore}</span>
              <HugeiconsIcon icon={ArrowDown02Icon} size={18} />
            </Button>

            <a href="#gallery" className="hero-button-secondary">
              <span>{copy.nav.gallery}</span>
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
            </a>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric-item">
              <strong>{metrics.stat1}</strong>
              <span>{metrics.label1}</span>
            </div>
            <div className="hero-metric-item">
              <strong>{metrics.stat2}</strong>
              <span>{metrics.label2}</span>
            </div>
            <div className="hero-metric-item">
              <strong>{metrics.stat3}</strong>
              <span>{metrics.label3}</span>
            </div>
          </div>
        </div>

        <figure className="hero-photo-panel">
          <img
            className="hero-photo"
            src="/images/akaki-kality-campus.jpeg"
            alt="Akaki Kality sub-city administration campus"
          />
          <figcaption>Akaki Kality Sub-city Administration</figcaption>
        </figure>

        <div className="hero-index" aria-hidden="true">
          <span>
            📍 08° 53′ N &nbsp;•&nbsp; 38° 47′ E &nbsp;•&nbsp; Addis Ababa
          </span>
        </div>
      </section>

      {/* About */}
      <section className="intro-section" id="about" lang={language}>
        <p className="section-kicker">{copy.introLabel}</p>
        <div className="intro-grid">
          <h2>{copy.introTitle}</h2>
          <div>
            <p>{copy.introBody}</p>
            <div className="campus-feature-card">
              <img
                src="/images/subcity-office.jpeg"
                alt="Akaki Kality Sub-City Administration Complex"
                loading="lazy"
              />
              <span className="campus-feature-badge">
                የአቃቂ ቃሊቲ አስተዳደር ማዕከል • Civic Headquarters
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="vision-section" id="vision" lang={language}>
        <div className="vision-photo">
          <img
            src="/images/tree-planting.jpeg"
            alt="Tree planting and environmental initiative at Akaki Kality"
            loading="lazy"
          />
        </div>
        <div className="vision-copy">
          <p className="section-kicker light">{copy.visionLabel}</p>
          <h2>{copy.visionTitle}</h2>
          <p>{copy.visionBody}</p>
        </div>
      </section>

      {/* Values */}
      <section className="values-section" id="values" lang={language}>
        <div className="values-heading">
          <div>
            <p className="section-kicker">{copy.valuesLabel}</p>
            <h2>{copy.valuesTitle}</h2>
          </div>
        </div>
        <div className="values-grid">
          {copy.values.map((value, index) => (
            <article key={value.title} className="value-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section" id="gallery" lang={language}>
        <div className="gallery-heading">
          <div>
            <p className="section-kicker">{copy.galleryLabel}</p>
            <h2>{copy.galleryTitle}</h2>
          </div>
          <p>{copy.galleryBody}</p>
        </div>
        <div className="photo-grid">
          {galleryImages.map((image, index) => (
            <figure
              key={image.src}
              className={`gallery-item item-${index + 1}`}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
              <div className="gallery-caption-overlay">
                <span>{image.alt}</span>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="wordmark footer-mark">
          <span className="wordmark-mark">አቃ</span>
          <span>{copy.footer}</span>
        </div>
        <p>
          © {new Date().getFullYear()} {copy.footer}. Civic Directory &amp;
          Public Information System.
        </p>
        <Link to="/admin/login" className="admin-entry">
          <HugeiconsIcon icon={LockPasswordIcon} size={15} />
          Admin Portal
        </Link>
      </footer>
      <FeedbackWidget language={language} />
    </main>
  )
}
