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
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      languages.findIndex((language) => language.key === value),
    ),
  )
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const active =
    languages.find((language) => language.key === value) ?? languages[0]

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  function focusOption(index: number) {
    const normalized = (index + languages.length) % languages.length
    setActiveIndex(normalized)
    requestAnimationFrame(() => optionRefs.current[normalized]?.focus())
  }

  function openMenu(index?: number) {
    const selectedIndex = Math.max(
      0,
      languages.findIndex((language) => language.key === value),
    )
    setOpen(true)
    focusOption(index ?? selectedIndex)
  }

  function closeAndRestoreFocus() {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  function selectLanguage(language: Language) {
    onChange(language)
    closeAndRestoreFocus()
  }

  return (
    <div className="language-menu" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className="language-menu-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="public-language-listbox"
        onClick={() => {
          if (open) closeAndRestoreFocus()
          else openMenu()
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            openMenu()
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            openMenu(languages.length - 1)
          }
        }}
      >
        <img src={active.flag} alt="" aria-hidden="true" />
        <span>{active.short}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="m5 7.5 5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          id="public-language-listbox"
          className="language-menu-popover"
          role="listbox"
          aria-label="Language"
        >
          {languages.map((language, index) => (
            <button
              key={language.key}
              ref={(node) => {
                optionRefs.current[index] = node
              }}
              type="button"
              role="option"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-selected={value === language.key}
              className="language-menu-option"
              data-active={value === language.key}
              onClick={() => selectLanguage(language.key)}
              onFocus={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  focusOption(index + 1)
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  focusOption(index - 1)
                } else if (event.key === 'Home') {
                  event.preventDefault()
                  focusOption(0)
                } else if (event.key === 'End') {
                  event.preventDefault()
                  focusOption(languages.length - 1)
                } else if (event.key === 'Escape') {
                  event.preventDefault()
                  closeAndRestoreFocus()
                } else if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  selectLanguage(language.key)
                }
              }}
            >
              <img src={language.flag} alt="" aria-hidden="true" />
              <span>
                <strong>{language.label}</strong>
                <small>{language.short}</small>
              </span>
              {value === language.key && (
                <span className="language-menu-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
