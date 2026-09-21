import { ArrowLeft02Icon, LockPasswordIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import { LanguageMenu } from '@/components/language-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import type { Language } from '@/lib/landing-content'

export const Route = createFileRoute('/admin_/login')({
  component: AdminLogin,
})

const loginCopy: Record<
  Language,
  {
    backToPublic: string
    badge: string
    title: string
    subtitle: string
    lead: string
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    submitButton: string
    submitting: string
    securityNote: string
    showPassword: string
    hidePassword: string
    fallbackError: string
  }
> = {
  am: {
    backToPublic: 'ወደ ዋናው ገጽ',
    badge: 'ይፋዊ የአስተዳደር መድረክ',
    title: 'የአስተዳደር መግቢያ',
    subtitle: 'አቃቂ ቃሊቲ ክፍለ ከተማ',
    lead: 'የወረዳ ማውጫዎችን እና ይፋዊ መረጃዎችን ለማስተዳደር የተፈቀደላቸው አስተዳዳሪዎች ይግቡ።',
    emailLabel: 'የአስተዳዳሪ ኢሜይል',
    emailPlaceholder: 'admin@akakikality.gov.et',
    passwordLabel: 'የይለፍ ቃል',
    passwordPlaceholder: '••••••••••••',
    submitButton: 'ወደ ማውጫ አስተዳደር ግባ',
    submitting: 'በማረጋገጥ ላይ…',
    securityNote: 'ለተፈቀደላቸው ባለስልጣናት ብቻ • የተጠበቀ መግቢያ',
    showPassword: 'የይለፍ ቃል አሳይ',
    hidePassword: 'የይለፍ ቃል ደብቅ',
    fallbackError: 'መግባት አልተቻለም። እባክዎ ግንኙነትዎን ያረጋግጡና እንደገና ይሞክሩ።',
  },
  om: {
    backToPublic: 'Gara fuula duraatti',
    badge: 'Waltajjii Bulchiinsaa Mootummaa',
    title: 'Karra Bulchiinsaa',
    subtitle: 'Kutaa Magaalaa Aqaaqii Qaallittii',
    lead: 'Galmee aanaalee fi odeeffannoo uummataa bulchuuf eeyyama kan qaban qofa seenu.',
    emailLabel: 'Imeelii bulchaa',
    emailPlaceholder: 'admin@akakikality.gov.et',
    passwordLabel: 'Jecha icciitii',
    passwordPlaceholder: '••••••••••••',
    submitButton: 'Gara Bulchiinsaatti Seeni',
    submitting: 'Mirkaneessaa jira…',
    securityNote: 'Hoggantoota eeyyamameef qofa • Karra Eegamaa',
    showPassword: 'Jecha icciitii agarsiisi',
    hidePassword: 'Jecha icciitii dhoksi',
    fallbackError: 'Seenuun hin danda’amne. Maaloo qunnamtii keessan mirkaneessaa ammas yaalaa.',
  },
  en: {
    backToPublic: 'Back to public site',
    badge: 'Official Directory Portal',
    title: 'Directory Sign In',
    subtitle: 'Akaki Kality Administration',
    lead: 'Sign in with authorized credentials to manage public woreda directories and civic registries.',
    emailLabel: 'Admin email',
    emailPlaceholder: 'admin@akakikality.gov.et',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••••••',
    submitButton: 'Access Admin Directory',
    submitting: 'Signing in…',
    securityNote: 'Authorized Personnel Only • Secure Civic Gateway',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    fallbackError: 'Could not sign in. Please check your connection and try again.',
  },
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2.7 12s3.4-5.5 9.3-5.5S21.3 12 21.3 12 17.9 17.5 12 17.5 2.7 12 2.7 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      {hidden && (
        <path
          d="m4 4 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

function AdminLogin() {
  const navigate = useNavigate()
  const session = authClient.useSession()
  const [language, setLanguage] = useState<Language>('am')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const copy = loginCopy[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    if (session.data?.user) void navigate({ to: '/admin' })
  }, [navigate, session.data?.user])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await authClient.signIn.email({
        email: String(formData.get('email') ?? '').trim(),
        password: String(formData.get('password') ?? ''),
      })

      if (result.error) {
        setError(result.error.message ?? 'Could not sign in.')
        return
      }

      await navigate({ to: '/admin' })
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : copy.fallbackError,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <header className="admin-login-topbar">
        <Link className="admin-login-back-link" to="/">
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
          <span>{copy.backToPublic}</span>
        </Link>
        <LanguageMenu value={language} onChange={setLanguage} />
      </header>

      <Card className="civic-elevated-card">
        <CardHeader className="civic-login-header">
          <div className="civic-login-emblem-wrap">
            <BrandLogo
              className="civic-login-emblem"
              alt={copy.subtitle}
            />
          </div>

          <div className="civic-portal-badge">
            <span className="civic-portal-badge-dot" aria-hidden="true" />
            <span>{copy.badge}</span>
          </div>

          <CardTitle className="civic-login-title">
            {copy.title}
          </CardTitle>
          <p className="civic-login-subtitle">
            {copy.subtitle}
          </p>
          <p className="civic-login-lead">
            {copy.lead}
          </p>
        </CardHeader>

        <CardContent className="civic-login-content">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel htmlFor="email" className="civic-field-label">
                  <span>{copy.emailLabel}</span>
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={copy.emailPlaceholder}
                  autoComplete="email"
                  required
                  className="civic-input"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="civic-field-label">
                  <span>{copy.passwordLabel}</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={copy.passwordPlaceholder}
                    autoComplete="current-password"
                    minLength={8}
                    required
                    className="civic-input pr-10"
                  />
                  <button
                    type="button"
                    className="civic-password-toggle"
                    aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <EyeIcon hidden={showPassword} />
                  </button>
                </div>
              </Field>

              {error && (
                <div className="civic-error-banner" role="alert">
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="civic-primary-button mt-0.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-3.5 w-3.5 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    {copy.submitting}
                  </span>
                ) : (
                  copy.submitButton
                )}
              </Button>
            </FieldGroup>
          </form>

          <div className="civic-security-badge">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={13}
              className="text-[#c88a18]"
            />
            <span>{copy.securityNote}</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
