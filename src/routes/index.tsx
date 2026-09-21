import { ArrowRight02Icon, LockPasswordIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import { FeedbackWidget } from '@/components/feedback-widget'
import { FooterSocialLinks } from '@/components/footer-social-links'
import { LanguageMenu } from '@/components/language-menu'
import { LeadershipSection } from '@/components/leadership-section'
import { ProsperityOverview } from '@/components/prosperity-overview'
import { galleryImages, landingCopy } from '@/lib/landing-content'
import type { Language } from '@/lib/landing-content'
import '@/home-modern.css'
import '@/home-mobile-fixes.css'

export const Route = createFileRoute('/')({ component: Home })

const uiCopy: Record<
  Language,
  {
    utility: string
    city: string
    brandTagline: string
    footerAdmin: string
    heroTop: string
    heroAccent: string
    primaryCta: string
    secondaryCta: string
    heroAsideLabel: string
    heroAsideTitle: string
    heroAsideBody: string
    bannerLabel: string
    leadershipNav: string
    galleryBody: string
    footerBody: string
    footerExplore: string
    footerLocation: string
    copyright: string
  }
> = {
  am: {
    utility: 'ንጹህ፣ ደህንነቱ የተጠበቀ እና የበለጸገ አቃቂ ቃሊቲ',
    city: 'አዲስ አበባ • ኢትዮጵያ',
    brandTagline: 'ህዝብ • አገልግሎት • የተሻለ ነገ',
    footerAdmin: 'የአስተዳደር መግቢያ',
    heroTop: 'የክፍለ ከተማዎ መረጃ፣',
    heroAccent: 'ሁሉም በአንድ ቦታ',
    primaryCta: 'አቃቂ ቃሊቲን ይወቁ',
    secondaryCta: 'ራዕይን ይመልከቱ',
    heroAsideLabel: 'ይፋዊ የክፍለ ከተማ መድረክ',
    heroAsideTitle: 'ለህዝብ ግልጽ፣ ቀላል እና ተደራሽ።',
    heroAsideBody:
      'ስለ አቃቂ ቃሊቲ፣ አመራሩ፣ ራዕዩ እና በክፍለ ከተማው እየተከናወኑ ያሉ ስራዎች የተደራጀ መረጃ።',
    bannerLabel: 'ይፋዊ ማንነት',
    leadershipNav: 'አመራር',
    galleryBody: 'የህዝብ ተቋማት፣ የልማት ስራዎች፣ የማህበረሰብ ፕሮግራሞች እና የአቃቂ ቃሊቲ የከተማ ገጽታ።',
    footerBody:
      'የአቃቂ ቃሊቲን መረጃ፣ ራዕይ እና የማህበረሰብ ሕይወት በግልጽ እና ተደራሽ መንገድ የሚያቀርብ ይፋዊ የዲጂታል መድረክ።',
    footerExplore: 'ይመልከቱ',
    footerLocation: 'አቃቂ ቃሊቲ ብልፅግና ፓርቲ (ህ\u2060/\u2060ግ) • አዲስ አበባ',
    copyright: 'መብቱ የተጠበቀ ነው።',
  },
  om: {
    utility: 'Aqaaqii Qaallittii qulqulluu, nageenya qabu fi badhaadhaa',
    city: 'Finfinnee • Itoophiyaa',
    brandTagline: 'Uummata • Tajaajila • Boru fooyya’aa',
    footerAdmin: 'Karra bulchiinsaa',
    heroTop: 'Odeeffannoo kutaa magaalaa keessanii,',
    heroAccent: 'iddoo tokko keessatti',
    primaryCta: 'Aqaaqii Qaallittii baruuf',
    secondaryCta: 'Mul’ata ilaali',
    heroAsideLabel: 'Waltajjii mootummaa kutaa magaalaa',
    heroAsideTitle: 'Uummataaf ifaa, salphaa fi dhaqqabamaa.',
    heroAsideBody:
      'Odeeffannoo qindaa’e waa’ee Aqaaqii Qaallittii, hoggansa, mul’ata fi hojii kutaa magaalichaa.',
    bannerLabel: 'Eenyummaa mootummaa',
    leadershipNav: 'Hoggansa',
    galleryBody:
      'Dhaabbilee uummataa, hojii misoomaa, sagantaalee hawaasaa fi bifa magaalaa Aqaaqii Qaallittii.',
    footerBody:
      'Waltajjii dijitaalaa mootummaa odeeffannoo, mul’ata fi jireenya hawaasaa Aqaaqii Qaallittii ifaa fi dhaqqabamaa ta’een dhiyeessu.',
    footerExplore: 'Sakatta’i',
    footerLocation: 'Paartii Badhaadhinaa Aqaaqii Qaallittii (QU) • Finfinnee',
    copyright: 'Mirgi hundi eegamaadha.',
  },
  en: {
    utility: 'Building a cleaner, safer and more prosperous Akaki Kality',
    city: 'Addis Ababa • Ethiopia',
    brandTagline: 'People • Service • Better tomorrow',
    footerAdmin: 'Admin Portal',
    heroTop: 'Your sub-city information,',
    heroAccent: 'all in one place',
    primaryCta: 'Explore Akaki Kality',
    secondaryCta: 'Read the vision',
    heroAsideLabel: 'Official sub-city platform',
    heroAsideTitle: 'Clear, simple and accessible to the public.',
    heroAsideBody:
      'Organized information about Akaki Kality, its leadership, vision and the work taking place across the sub-city.',
    bannerLabel: 'Official identity',
    leadershipNav: 'Leadership',
    galleryBody:
      'Public institutions, development work, community programs and the urban character of Akaki Kality.',
    footerBody:
      'The official digital home for clear, accessible information about Akaki Kality, its vision and its community life.',
    footerExplore: 'Explore',
    footerLocation: 'Akaki Kality Prosperity Party (PR) • Addis Ababa',
    copyright: 'All rights reserved.',
  },
}

function Home() {
  const [language, setLanguage] = useState<Language>('am')
  const copy = landingCopy[language]
  const ui = uiCopy[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const sectionLinks = [
    { href: '#about', label: copy.introLabel },
    { href: '#leadership', label: ui.leadershipNav },
    { href: '#vision', label: copy.nav.vision },
    { href: '#gallery', label: copy.nav.gallery },
  ]

  return (
    <main className="civic-home" id="home">
      <div className="civic-utility">
        <div className="civic-shell civic-utility-inner">
          <strong>{ui.utility}</strong>
          <div className="civic-utility-meta">
            <span>{ui.city}</span>
            <span className="civic-dot-separator" aria-hidden="true" />
            <span>08° 53′ N • 38° 47′ E</span>
          </div>
        </div>
      </div>

      <div className="civic-header-wrap">
        <header className="civic-shell civic-header">
          <a
            className="civic-brand"
            href="#home"
            aria-label={`${copy.footer} - ${copy.nav.home}`}
          >
            <BrandLogo className="civic-brand-logo" alt="" />
            <span className="civic-brand-copy">
              <strong>{copy.footer}</strong>
              <span>{ui.brandTagline}</span>
            </span>
          </a>

          <nav className="civic-nav" aria-label="Primary navigation">
            {sectionLinks.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <LanguageMenu value={language} onChange={setLanguage} />
        </header>
      </div>

      <section className="civic-official-banner" aria-label={ui.bannerLabel}>
        <div className="civic-shell">
          <div className="civic-banner-fallback" lang={language}>
            <div className="civic-banner-spacer" aria-hidden="true" />
            <div>
              <small>{ui.bannerLabel}</small>
              <strong>{copy.footer}</strong>
              <span>{ui.brandTagline}</span>
            </div>
            <BrandLogo className="civic-banner-logo" />
          </div>
        </div>
      </section>

      <section className="civic-hero">
        <div className="civic-shell civic-hero-grid">
          <div className="civic-hero-copy" lang={language}>
            <p className="civic-eyebrow">{copy.eyebrow}</p>
            <h1>
              {ui.heroTop}
              <span>{ui.heroAccent}</span>
            </h1>
            <p className="civic-hero-lead">{copy.lead}</p>

            <div className="civic-hero-actions">
              <a className="civic-primary-cta" href="#about">
                <span>{ui.primaryCta}</span>
                <HugeiconsIcon icon={ArrowRight02Icon} size={17} />
              </a>
              <a className="civic-secondary-cta" href="#vision">
                <span>{ui.secondaryCta}</span>
                <HugeiconsIcon icon={ArrowRight02Icon} size={17} />
              </a>
            </div>
          </div>

          <aside className="civic-hero-brief" lang={language}>
            <span>{ui.heroAsideLabel}</span>
            <h2>{ui.heroAsideTitle}</h2>
            <p>{ui.heroAsideBody}</p>
            <div className="civic-hero-coordinate">
              <small>{ui.city}</small>
              <strong>08° 53′ N</strong>
            </div>
          </aside>
        </div>
      </section>

      <nav className="civic-section-rail" aria-label="Page sections">
        <div className="civic-shell">
          {sectionLinks.map((item, index) => (
            <a key={item.href} href={item.href}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section className="civic-section" id="about" lang={language}>
        <div className="civic-shell civic-about-grid">
          <div className="civic-about-copy">
            <p className="civic-section-kicker">{copy.introLabel}</p>
            <h2 className="civic-section-heading">{copy.introTitle}</h2>
            <p>{copy.introBody}</p>
          </div>

          <div className="civic-about-media">
            <figure>
              <img
                src="/images/rebika/facility-collage.webp"
                alt="Public facilities and community infrastructure"
                loading="lazy"
                decoding="async"
                width={520}
                height={520}
              />
            </figure>
            <figure>
              <img
                src="/images/rebika/public-square.webp"
                alt="Public square and administration buildings"
                loading="lazy"
                decoding="async"
                width={520}
                height={346}
              />
            </figure>
            <figure>
              <img
                src="/images/rebika/development-collage.webp"
                alt="Development projects and public services"
                loading="lazy"
                decoding="async"
                width={480}
                height={480}
              />
            </figure>
          </div>
        </div>
      </section>

      <LeadershipSection language={language} />
      <ProsperityOverview language={language} />

      <section
        className="civic-section civic-gallery-section"
        id="gallery"
        lang={language}
      >
        <div className="civic-shell">
          <div className="civic-gallery-heading">
            <div>
              <p className="civic-section-kicker">{copy.galleryLabel}</p>
              <h2 className="civic-section-heading">{copy.galleryTitle}</h2>
            </div>
            <p>{ui.galleryBody}</p>
          </div>

          <div className="civic-gallery-grid">
            {galleryImages.slice(0, 6).map((image) => (
              <figure key={image.src}>
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  width={520}
                  height={347}
                />
                <figcaption>{image.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <footer className="civic-footer" lang={language}>
        <div className="civic-shell">
          <div className="civic-footer-grid">
            <div>
              <a className="civic-brand" href="#home">
                <BrandLogo className="civic-brand-logo" />
                <span className="civic-brand-copy">
                  <strong>{copy.footer}</strong>
                  <span>{ui.brandTagline}</span>
                </span>
              </a>
              <p>{ui.footerBody}</p>
              <FooterSocialLinks language={language} />
            </div>

            <div>
              <h3>{ui.footerExplore}</h3>
              <div className="civic-footer-links">
                {sectionLinks.map((item) => (
                  <a key={item.href} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3>{ui.city}</h3>
              <div className="civic-footer-links">
                <span>{ui.footerLocation}</span>
                <span>08° 53′ N • 38° 47′ E</span>
              </div>
            </div>
          </div>

          <div className="civic-footer-bottom">
            <span>
              © {new Date().getFullYear()} {copy.footer}. {ui.copyright}
            </span>
            <Link to="/admin/login" className="civic-footer-admin">
              <HugeiconsIcon icon={LockPasswordIcon} size={14} />
              <span>{ui.footerAdmin}</span>
            </Link>
          </div>
        </div>
      </footer>

      <FeedbackWidget language={language} />
    </main>
  )
}
