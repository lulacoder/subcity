import { ArrowDown02Icon, Globe02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  galleryImages,
  landingCopy,
  type Language,
} from '@/lib/landing-content'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [language, setLanguage] = useState<Language>('am')
  const copy = landingCopy[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <main className="landing-page" id="home">
      <header className="landing-header">
        <a className="wordmark" href="#home" aria-label={copy.nav.home}>
          <span className="wordmark-mark">አቃ</span>
          <span>{copy.title}</span>
        </a>
        <nav className="landing-nav" aria-label="Primary navigation">
          <a href="#vision">{copy.nav.vision}</a>
          <a href="#values">{copy.nav.values}</a>
          <a href="#gallery">{copy.nav.gallery}</a>
        </nav>
        <div className="language-picker" aria-label="Choose language">
          <HugeiconsIcon icon={Globe02Icon} size={17} />
          {(['am', 'om', 'en'] as const).map((item) => (
            <button
              key={item}
              type="button"
              data-active={item === language}
              aria-label={landingCopy[item].languageName}
              onClick={() => setLanguage(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-photo-wrap">
          <img
            className="hero-photo"
            src="/images/akaki-kality-campus.jpeg"
            alt="Landscaped grounds at Akaki Kality"
          />
          <div className="hero-shade" />
        </div>
        <div className="hero-copy" lang={language}>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="hero-lead">{copy.lead}</p>
          <Button
            render={<a href="#about" />}
            nativeButton={false}
            className="hero-button"
            size="lg"
          >
            {copy.explore}
            <HugeiconsIcon icon={ArrowDown02Icon} />
          </Button>
        </div>
        <div className="hero-index" aria-hidden="true">
          08° 53′ N&nbsp;&nbsp; 38° 47′ E
        </div>
      </section>

      <section className="intro-section" id="about" lang={language}>
        <p className="section-kicker">{copy.introLabel}</p>
        <div className="intro-grid">
          <h2>{copy.introTitle}</h2>
          <p>{copy.introBody}</p>
        </div>
      </section>

      <section className="vision-section" id="vision" lang={language}>
        <div className="vision-photo">
          <img
            src="/images/tree-planting.jpeg"
            alt="Tree planting at the Akaki Kality compound"
          />
        </div>
        <div className="vision-copy">
          <p className="section-kicker light">{copy.visionLabel}</p>
          <h2>{copy.visionTitle}</h2>
          <p>{copy.visionBody}</p>
        </div>
      </section>

      <section className="values-section" id="values" lang={language}>
        <div className="values-heading">
          <p className="section-kicker">{copy.valuesLabel}</p>
          <h2>{copy.valuesTitle}</h2>
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
            <figure key={image.src} className={`gallery-item item-${index + 1}`}>
              <img src={image.src} alt={image.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="wordmark footer-mark">
          <span className="wordmark-mark">አቃ</span>
          <span>{copy.footer}</span>
        </div>
        <p>© {new Date().getFullYear()}</p>
        <Link to="/admin/login" className="admin-entry">
          Admin
        </Link>
      </footer>
    </main>
  )
}
