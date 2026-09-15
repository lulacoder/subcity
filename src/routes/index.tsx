import {
  ArrowRight02Icon,
  Globe02Icon,
  LockPasswordIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { FeedbackWidget } from '@/components/feedback-widget'
import { galleryImages, landingCopy } from '@/lib/landing-content'
import type { Language } from '@/lib/landing-content'
import '@/home-modern.css'
import '@/home-mobile-fixes.css'

export const Route = createFileRoute('/')({ component: Home })

const languageList: Array<{
  key: Language
  native: string
}> = [
  { key: 'am', native: 'አማ' },
  { key: 'om', native: 'OR' },
  { key: 'en', native: 'EN' },
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

const uiCopy: Record<
  Language,
  {
    utility: string
    city: string
    admin: string
    brandTagline: string
    footerAdmin: string
    heroTop: string
    heroAccent: string
    primaryCta: string
    secondaryCta: string
    liveNote: string
    visualLabel: string
    visualTitle: string
    visualBody: string
    quickLabel: string
    quickCards: Array<{ title: string; body: string }>
    valuesBody: string
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
    admin: 'አስተዳደር',
    brandTagline: 'ህዝብ • አገልግሎት • የተሻለ ነገ',
    footerAdmin: 'የአስተዳደር መግቢያ',
    heroTop: 'የክፍለ ከተማዎ መረጃ፣',
    heroAccent: 'ሁሉም በአንድ ቦታ',
    primaryCta: 'አቃቂ ቃሊቲን ይወቁ',
    secondaryCta: 'ማዕከለ ስዕላት',
    liveNote: 'ይፋዊ የክፍለ ከተማ መረጃ እና የማህበረሰብ መድረክ',
    visualLabel: 'የህዝብ አገልግሎት',
    visualTitle: 'ለሰዎች ቀላል፣ ግልጽ እና ተደራሽ።',
    visualBody: 'አቃቂ ቃሊቲን እና የክፍለ ከተማውን የህዝብ ስራ በአንድ የተደራጀ ቦታ ይወቁ።',
    quickLabel: 'በፍጥነት ይፈልጉ',
    quickCards: [
      { title: 'ስለ አቃቂ ቃሊቲ', body: 'ስለ ክፍለ ከተማው አጭር መግቢያ።' },
      { title: 'ራዕያችን', body: 'ክፍት፣ ተሳታፊ እና ለኑሮ ምቹ ከተማ።' },
      { title: 'እሴቶቻችን', body: 'የህዝብ አገልግሎታችንን የሚመሩ መርሆዎች።' },
      { title: 'ማዕከለ ስዕላት', body: 'የቦታዎች፣ ሰዎች እና ማህበረሰብ ትዕይንቶች።' },
    ],
    valuesBody: 'የህዝብ አገልግሎት ለእኛ የቢሮ ስራ ብቻ አይደለም። ሰዎች በቀላሉ ሊረዱት፣ ሊደርሱበት እና ሊተማመኑበት የሚችሉ ልምድ መፍጠር ነው።',
    galleryBody: 'ከአስተዳደሩ ግቢ፣ ከማህበረሰብ ፕሮግራሞች እና ከአረንጓዴ ስፍራዎች የተወሰዱ ምስሎች።',
    footerBody: 'የአቃቂ ቃሊቲን መረጃ፣ ራዕይ እና የማህበረሰብ ሕይወት በግልጽ እና ተደራሽ መንገድ የሚያቀርብ ይፋዊ የዲጂታል መድረክ።',
    footerExplore: 'ይመልከቱ',
    footerLocation: 'አቃቂ ቃሊቲ ክፍለ ከተማ • አዲስ አበባ',
    copyright: 'መብቱ የተጠበቀ ነው።',
  },
  om: {
    utility: 'Aqaaqii Qaallittii qulqulluu, nageenya qabu fi badhaadhaa',
    city: 'Finfinnee • Itoophiyaa',
    admin: 'Bulchiinsa',
    brandTagline: 'Uummata • Tajaajila • Boru fooyya’aa',
    footerAdmin: 'Karra bulchiinsaa',
    heroTop: 'Odeeffannoo kutaa magaalaa keessanii,',
    heroAccent: 'iddoo tokko keessatti',
    primaryCta: 'Aqaaqii Qaallittii baruuf',
    secondaryCta: 'Kuusaa suuraa',
    liveNote: 'Odeeffannoo mootummaa kutaa magaalaa fi waltajjii hawaasaa',
    visualLabel: 'Tajaajila uummataa',
    visualTitle: 'Salphaa, ifaa fi nama hundaaf dhaqqabamaa.',
    visualBody: 'Aqaaqii Qaallittii fi hojii uummataa kutaa magaalichaa iddoo qindaa’e tokko keessatti baruuf.',
    quickLabel: 'Saffisaan ilaali',
    quickCards: [
      { title: 'Waa’ee kutaa magaalaa', body: 'Seensa gabaabaa waa’ee Aqaaqii Qaallittii.' },
      { title: 'Mul’ata keenya', body: 'Kutaa magaalaa banaa, hirmaachisaa fi jireenyaaf mijataa.' },
      { title: 'Duudhaa keenya', body: 'Qajeelfamoota tajaajila uummataa keenya.' },
      { title: 'Kuusaa suuraa', body: 'Iddoowwan, namootaa fi yeroo hawaasaa.' },
    ],
    valuesBody: 'Tajaajilli uummataa hojii waajjiraa qofa miti. Muuxannoo namoonni salphaatti hubatan, argatan fi itti amananii fayyadaman ijaaruu dha.',
    galleryBody: 'Suuraalee mooraa bulchiinsaa, sagantaalee hawaasaa fi iddoowwan magariisaa irraa fudhataman.',
    footerBody: 'Waltajjii dijitaalaa mootummaa odeeffannoo, mul’ata fi jireenya hawaasaa Aqaaqii Qaallittii ifaa fi dhaqqabamaa ta’een dhiyeessu.',
    footerExplore: 'Sakatta’i',
    footerLocation: 'Kutaa Magaalaa Aqaaqii Qaallittii • Finfinnee',
    copyright: 'Mirgi hundi eegamaadha.',
  },
  en: {
    utility: 'Building a cleaner, safer and more prosperous Akaki Kality',
    city: 'Addis Ababa • Ethiopia',
    admin: 'Admin',
    brandTagline: 'People • Service • Better tomorrow',
    footerAdmin: 'Admin Portal',
    heroTop: 'Your sub-city information,',
    heroAccent: 'all in one place',
    primaryCta: 'Explore Akaki Kality',
    secondaryCta: 'View gallery',
    liveNote: 'Official sub-city information and community platform',
    visualLabel: 'Public service',
    visualTitle: 'Simple, open and accessible to everyone.',
    visualBody: 'Discover Akaki Kality and the public work shaping the sub-city from one clear, organized place.',
    quickLabel: 'Find it faster',
    quickCards: [
      { title: 'About the sub-city', body: 'A clear introduction to Akaki Kality and its character.' },
      { title: 'Our vision', body: 'A more open, participatory and liveable sub-city.' },
      { title: 'Civic values', body: 'The principles guiding public service and shared progress.' },
      { title: 'Photo gallery', body: 'Places, people and moments from across the community.' },
    ],
    valuesBody: 'Public service should not feel like paperwork. It should be an experience people can understand, access and trust — with clarity at every step.',
    galleryBody: 'Scenes from the administration campus, community programs and the greener public spaces that shape Akaki Kality.',
    footerBody: 'The official digital home for clear, accessible information about Akaki Kality, its vision and its community life.',
    footerExplore: 'Explore',
    footerLocation: 'Akaki Kality Sub-city • Addis Ababa',
    copyright: 'All rights reserved.',
  },
}

const sectionLinks = ['#about', '#vision', '#values', '#gallery'] as const

function Home() {
  const [language, setLanguage] = useState<Language>('am')
  const copy = landingCopy[language]
  const metrics = metricLabels[language]
  const ui = uiCopy[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <main className="civic-home" id="home">
      <div className="civic-utility">
        <div className="civic-shell civic-utility-inner">
          <div className="civic-utility-copy">
            <strong>{ui.utility}</strong>
          </div>
          <div className="civic-utility-meta">
            <span>{ui.city}</span>
            <span className="civic-dot-separator" aria-hidden="true" />
            <span>08° 53′ N • 38° 47′ E</span>
          </div>
        </div>
      </div>

      <div className="civic-header-wrap">
        <header className="civic-shell civic-header">
          <a className="civic-brand" href="#home" aria-label={copy.nav.home}>
            <img
              className="civic-brand-logo"
              src="/images/akaki-kality-mark.svg"
              alt=""
              aria-hidden="true"
            />
            <span className="civic-brand-copy">
              <strong>{copy.footer}</strong>
              <span>{ui.brandTagline}</span>
            </span>
          </a>

          <nav className="civic-nav" aria-label="Primary navigation">
            <a href="#about">{copy.nav.home}</a>
            <a href="#vision">{copy.nav.vision}</a>
            <a href="#values">{copy.nav.values}</a>
            <a href="#gallery">{copy.nav.gallery}</a>
          </nav>

          <div className="civic-header-actions">
            <label className="civic-language">
              <HugeiconsIcon icon={Globe02Icon} size={16} />
              <span className="sr-only">Select language</span>
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
                aria-label="Select language"
              >
                {languageList.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.native}
                  </option>
                ))}
              </select>
            </label>

            <Link to="/admin/login" className="civic-admin-link">
              <HugeiconsIcon icon={LockPasswordIcon} size={16} />
              <span>{ui.admin}</span>
            </Link>
          </div>
        </header>
      </div>

      <section className="civic-hero">
        <div className="civic-shell civic-hero-grid">
          <div className="civic-hero-copy" lang={language}>
            <div className="civic-eyebrow">{copy.eyebrow}</div>
            <h1>
              {ui.heroTop}
              <span className="accent">{ui.heroAccent}</span>
            </h1>
            <p className="civic-hero-lead">{copy.lead}</p>

            <div className="civic-hero-actions">
              <a className="civic-primary-cta" href="#about">
                <span>{ui.primaryCta}</span>
                <HugeiconsIcon icon={ArrowRight02Icon} size={17} />
              </a>
              <a className="civic-secondary-cta" href="#gallery">
                <span>{ui.secondaryCta}</span>
                <HugeiconsIcon icon={ArrowRight02Icon} size={17} />
              </a>
            </div>

            <div className="civic-hero-note">
              <span aria-hidden="true" />
              <span>{ui.liveNote}</span>
            </div>
          </div>

          <div className="civic-hero-visual" aria-label="Akaki Kality campus">
            <div className="civic-hero-photo-frame">
              <img
                src="/images/akaki-kality-campus.jpeg"
                alt="Landscaped grounds at Akaki Kality Sub-city Administration"
              />
            </div>

            <div className="civic-hero-badge" aria-hidden="true">
              <img src="/images/akaki-kality-mark.svg" alt="" />
            </div>

            <div className="civic-hero-card" lang={language}>
              <small>{ui.visualLabel}</small>
              <strong>{ui.visualTitle}</strong>
              <p>{ui.visualBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="civic-shell civic-quick-wrap" aria-label={ui.quickLabel}>
        <div className="civic-quick-grid">
          {ui.quickCards.map((item, index) => (
            <a
              key={item.title}
              className="civic-quick-card"
              href={sectionLinks[index]}
              lang={language}
            >
              <span className="civic-quick-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="civic-section" id="about" lang={language}>
        <div className="civic-shell civic-about-grid">
          <div className="civic-about-copy">
            <p className="civic-section-kicker">{copy.introLabel}</p>
            <h2 className="civic-section-heading">{copy.introTitle}</h2>
            <p>{copy.introBody}</p>

            <div className="civic-stats">
              <div className="civic-stat">
                <strong>{metrics.stat1}</strong>
                <span>{metrics.label1}</span>
              </div>
              <div className="civic-stat">
                <strong>{metrics.stat2}</strong>
                <span>{metrics.label2}</span>
              </div>
              <div className="civic-stat">
                <strong>{metrics.stat3}</strong>
                <span>{metrics.label3}</span>
              </div>
            </div>
          </div>

          <div className="civic-about-media">
            <figure>
              <img
                src="/images/subcity-office.jpeg"
                alt="Akaki Kality Sub-city Administration office"
                loading="lazy"
              />
            </figure>
            <figure>
              <img
                src="/images/community-welcome.jpeg"
                alt="Community welcome at Akaki Kality"
                loading="lazy"
              />
            </figure>
            <figure>
              <img
                src="/images/green-campus.jpeg"
                alt="Green public grounds at Akaki Kality"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      <div className="civic-vision-wrap" id="vision">
        <section className="civic-vision" lang={language}>
          <div className="civic-vision-media">
            <img
              src="/images/tree-planting.jpeg"
              alt="Tree planting and environmental initiative at Akaki Kality"
              loading="lazy"
            />
          </div>
          <div className="civic-vision-copy">
            <p className="civic-section-kicker">{copy.visionLabel}</p>
            <h2>{copy.visionTitle}</h2>
            <p>{copy.visionBody}</p>
          </div>
        </section>
      </div>

      <section className="civic-section" id="values" lang={language}>
        <div className="civic-shell">
          <div className="civic-values-heading">
            <div>
              <p className="civic-section-kicker">{copy.valuesLabel}</p>
              <h2 className="civic-section-heading">{copy.valuesTitle}</h2>
            </div>
            <p>{ui.valuesBody}</p>
          </div>

          <div className="civic-values-grid">
            {copy.values.map((value, index) => (
              <article key={value.title} className="civic-value-card">
                <span className="civic-value-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
            {galleryImages.slice(0, 4).map((image) => (
              <figure key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
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
                <img
                  className="civic-brand-logo"
                  src="/images/akaki-kality-mark.svg"
                  alt=""
                  aria-hidden="true"
                />
                <span className="civic-brand-copy">
                  <strong>{copy.footer}</strong>
                  <span>{ui.brandTagline}</span>
                </span>
              </a>
              <p>{ui.footerBody}</p>
            </div>

            <div>
              <h3>{ui.footerExplore}</h3>
              <div className="civic-footer-links">
                <a href="#about">{copy.introLabel}</a>
                <a href="#vision">{copy.nav.vision}</a>
                <a href="#values">{copy.nav.values}</a>
                <a href="#gallery">{copy.nav.gallery}</a>
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
