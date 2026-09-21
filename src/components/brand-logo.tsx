import { useState } from 'react'

import {
  PROSPERITY_PARTY_LOGO_FALLBACK_URL,
  PROSPERITY_PARTY_LOGO_URL,
} from '@/lib/brand'

export function BrandLogo({
  className,
  alt = 'Akaki Kality Sub-City Administration',
}: {
  className?: string
  alt?: string
}) {
  const [source, setSource] = useState(PROSPERITY_PARTY_LOGO_URL)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={alt}
        role="img"
      >
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#c88a18" strokeWidth="3" />
        <circle cx="50" cy="50" r="43" fill="#062a4a" stroke="#f2bd35" strokeWidth="1.5" strokeDasharray="3 2" />
        <g stroke="#f2bd35" strokeWidth="1.8" strokeLinecap="round" opacity="0.9">
          <line x1="50" y1="14" x2="50" y2="20" />
          <line x1="50" y1="80" x2="50" y2="86" />
          <line x1="14" y1="50" x2="20" y2="50" />
          <line x1="80" y1="50" x2="86" y2="50" />
          <line x1="24.5" y1="24.5" x2="28.8" y2="28.8" />
          <line x1="71.2" y1="71.2" x2="75.5" y2="75.5" />
          <line x1="24.5" y1="75.5" x2="28.8" y2="71.2" />
          <line x1="71.2" y1="28.8" x2="75.5" y2="24.5" />
        </g>
        <path
          d="M50 28 L64 36 V52 C64 62 50 72 50 72 C50 72 36 62 36 52 V36 Z"
          fill="#0c3963"
          stroke="#f2bd35"
          strokeWidth="2"
        />
        <polygon
          points="50,38 52.8,44 59,44.5 54.2,48.5 55.8,54.5 50,51 44.2,54.5 45.8,48.5 41,44.5 47.2,44"
          fill="#f2bd35"
        />
      </svg>
    )
  }

  return (
    <img
      className={className}
      src={source}
      alt={alt}
      onError={() => {
        if (source !== PROSPERITY_PARTY_LOGO_FALLBACK_URL) {
          setSource(PROSPERITY_PARTY_LOGO_FALLBACK_URL)
        } else {
          setHasError(true)
        }
      }}
    />
  )
}

