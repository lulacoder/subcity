import { useState } from 'react'

import {
  PROSPERITY_PARTY_LOGO_FALLBACK_URL,
  PROSPERITY_PARTY_LOGO_URL,
} from '@/lib/brand'

export function BrandLogo({ className }: { className?: string }) {
  const [source, setSource] = useState(PROSPERITY_PARTY_LOGO_URL)

  return (
    <img
      className={className}
      src={source}
      alt=""
      aria-hidden="true"
      onError={() => {
        if (source !== PROSPERITY_PARTY_LOGO_FALLBACK_URL) {
          setSource(PROSPERITY_PARTY_LOGO_FALLBACK_URL)
        }
      }}
    />
  )
}
