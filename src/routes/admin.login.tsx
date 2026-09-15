import { ArrowLeft02Icon, LockPasswordIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
})

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2.7 12s3.4-5.5 9.3-5.5S21.3 12 21.3 12 17.9 17.5 12 17.5 2.7 12 2.7 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
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
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
          : 'Could not sign in. Please check your connection and try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <Link className="back-link" to="/">
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
        Back to public site
      </Link>

      <Card className="login-card">
        <CardHeader className="text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="login-icon">
              <HugeiconsIcon icon={LockPasswordIcon} size={22} />
            </div>
            <div>
              <p className="admin-overline">Verified Portal</p>
              <span className="text-xs text-blue-200/80 font-medium">
                Akaki Kality Administration
              </span>
            </div>
          </div>
          <CardTitle className="mt-2 text-2xl font-bold tracking-tight">
            Directory sign in
          </CardTitle>
          <p className="text-sm text-white/70">
            Sign in with authorized super-admin credentials to manage public
            woreda links.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="email">Admin email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@akakikality.gov.et"
                  autoComplete="email"
                  required
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="admin-password-input-wrap">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    minLength={12}
                    required
                  />
                  <button
                    type="button"
                    className="admin-password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <EyeIcon hidden={showPassword} />
                  </button>
                </div>
              </Field>
              <FieldError>{error}</FieldError>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-lg shadow-blue-950/40"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in…' : 'Access Admin Directory'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
