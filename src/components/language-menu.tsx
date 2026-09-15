import { useEffect, useRef, useState } from 'react'

import type { Language } from '@/lib/landing-content'
import '@/language-menu.css'

const languages: Array<{
  key: Language
  short: string
  label: string
  flag: string
}> = [
  {
    key: 'am',
    short: 'አማ',
    label: 'አማርኛ',
    flag: 'https://flagcdn.com/w40/et.png',
  },
  {
    key: 'om',
    short: 'OR',
    label: 'Afaan Oromoo',
    flag: 'https://flagcdn.com/w40/et.png',
  },
  {
    key: 'en',
    short: 'EN',
    label: 'English',
    flag: 'https://flagcdn.com/w40/gb.png',
  },
]

export function LanguageMenu({
  value,
  onChange,
}: {
  value: Language
  onChange: (language: Language) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const active = languages.find((language) => language.key === value) ?? languages[0]

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className="language-menu" ref={wrapRef}>
      <button
        type="button"
        className="language-menu-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <img src={active.flag} alt="" aria-hidden="true" />
        <span>{active.short}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="language-menu-popover" role="listbox" aria-label="Language">
          {languages.map((language) => (
            <button
              key={language.key}
              type="button"
              role="option"
              aria-selected={value === language.key}
              className="language-menu-option"
              data-active={value === language.key}
              onClick={() => {
                onChange(language.key)
                setOpen(false)
              }}
            >
              <img src={language.flag} alt="" aria-hidden="true" />
              <span>
                <strong>{language.label}</strong>
                <small>{language.short}</small>
              </span>
              {value === language.key && <span className="language-menu-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
