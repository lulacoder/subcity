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

function AdminLogin() {
  const navigate = useNavigate()
  const session = authClient.useSession()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (session.data?.user) void navigate({ to: '/admin' })
  }, [navigate, session.data?.user])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const result = await authClient.signIn.email({
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    })

    setIsSubmitting(false)
    if (result.error) {
      setError(result.error.message ?? 'Could not sign in.')
      return
    }

    await navigate({ to: '/admin' })
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
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  minLength={12}
                  required
                />
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
