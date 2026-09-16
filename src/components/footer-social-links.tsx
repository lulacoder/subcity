import {
  Facebook01Icon,
  InstagramIcon,
  NewTwitterIcon,
  TiktokIcon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import type { Language } from '@/lib/landing-content'
import '@/footer-social-links.css'

const socialHeading: Record<Language, string> = {
  am: 'በማህበራዊ ሚዲያ ይከተሉን',
  om: 'Miidiyaa hawaasaa irratti nu hordofaa',
  en: 'Follow us on social media',
}

const socialLinks = [
  {
    label: 'YouTube',
    href: 'https://youtube.com/@akakikalityposperity?si=-vdEcEkUgYqM4CUN',
    icon: YoutubeIcon,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@akakikality1212?_r=1&_t=ZS-99mXjER82uD',
    icon: TiktokIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/p/DdBP47JtIpM/?stkn=MWJqejQ4OGh3bHA5bg==',
    icon: InstagramIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61578155890289',
    icon: Facebook01Icon,
  },
  {
    label: 'X',
    href: 'https://x.com/Ak_kProsperity',
    icon: NewTwitterIcon,
  },
] as const

export function FooterSocialLinks({ language }: { language: Language }) {
  return (
    <div className="civic-social-block">
      <span className="civic-social-heading">{socialHeading[language]}</span>
      <div className="civic-social-links" aria-label={socialHeading[language]}>
        {socialLinks.map(({ label, href, icon }) => (
          <a
            key={label}
            className="civic-social-link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <HugeiconsIcon icon={icon} size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
