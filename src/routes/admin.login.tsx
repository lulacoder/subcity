import { ArrowLeft02Icon, LockPasswordIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
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
        Back to site
      </Link>
      <Card className="login-card">
        <CardHeader>
          <div className="login-icon">
            <HugeiconsIcon icon={LockPasswordIcon} size={22} />
          </div>
          <p className="admin-overline">Private workspace</p>
          <CardTitle className="text-2xl">Directory sign in</CardTitle>
          <p className="text-muted-foreground">
            Use the super-admin account to manage city and woreda links.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
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
                  autoComplete="current-password"
                  minLength={12}
                  required
                />
              </Field>
              <FieldError>{error}</FieldError>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
