import {
  AccountSetting01Icon,
  Link01Icon,
  Logout01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useMutation as useConvexMutation } from 'convex/react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { api } from '../../../convex/_generated/api'
import { PasswordDialog } from '@/components/admin/password-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BrandLogo } from '@/components/brand-logo'
import { authClient } from '@/lib/auth-client'
import '@/admin-modern.css'

function MenuIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 7h14M5 12h14M5 17h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function AdminShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = authClient.useSession()
  const [navOpen, setNavOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const changePasswordFn = useConvexMutation(api.users.changePassword)
  const changePassword = useMutation({ mutationFn: changePasswordFn })

  if (location.pathname === '/admin/login') return <>{children}</>

  const directoryActive =
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin/areas')
  const surveysActive = location.pathname.startsWith('/admin/surveys')

  async function confirmLogout() {
    setLoggingOut(true)
    try {
      await authClient.signOut()
      queryClient.clear()
      await navigate({ to: '/admin/login', replace: true })
    } finally {
      setLoggingOut(false)
      setLogoutOpen(false)
    }
  }

  return (
    <div className="admin-app-shell">
      <button
        type="button"
        className="admin-mobile-menu"
        aria-label="Open admin navigation"
        onClick={() => setNavOpen(true)}
      >
        <MenuIcon />
      </button>

      {navOpen && (
        <button
          type="button"
          className="admin-nav-backdrop"
          aria-label="Close admin navigation"
          onClick={() => setNavOpen(false)}
        />
      )}

      <aside className="admin-app-sidebar" data-open={navOpen}>
        <div>
          <Link
            className="admin-app-brand"
            to="/"
            onClick={() => setNavOpen(false)}
          >
            <BrandLogo className="admin-app-brand-logo" alt="Akaki Kality Administration" />
            <span>
              <strong>Akaki Kality</strong>
              <small>Administration</small>
            </span>
          </Link>

          <div className="admin-app-section-label">Workspace</div>
          <nav className="admin-app-nav" aria-label="Admin navigation">
            <Link
              to="/admin"
              data-active={directoryActive}
              onClick={() => setNavOpen(false)}
            >
              <HugeiconsIcon icon={Link01Icon} size={18} />
              <span>Directory</span>
            </Link>
            <Link
              to="/admin/surveys"
              data-active={surveysActive}
              onClick={() => setNavOpen(false)}
            >
              <span className="admin-nav-survey-icon">◫</span>
              <span>Surveys</span>
            </Link>
            <button type="button" onClick={() => setPasswordOpen(true)}>
              <HugeiconsIcon icon={AccountSetting01Icon} size={18} />
              <span>Change password</span>
            </button>
          </nav>
        </div>

        <div className="admin-app-account">
          <div className="admin-account-avatar" aria-hidden="true">
            {(session.data?.user.name || session.data?.user.email || 'A')
              .slice(0, 1)
              .toUpperCase()}
          </div>
          <div className="admin-account-copy">
            <strong>{session.data?.user.name || 'Administrator'}</strong>
            <small>{session.data?.user.email || 'Private admin account'}</small>
          </div>
          <button
            type="button"
            className="admin-account-logout"
            aria-label="Sign out"
            title="Sign out"
            onClick={() => setLogoutOpen(true)}
          >
            <HugeiconsIcon icon={Logout01Icon} size={17} />
          </button>
        </div>
      </aside>

      <main className="admin-app-content">{children}</main>

      <PasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        isSaving={changePassword.isPending}
        onChangePassword={async (values) => {
          await changePassword.mutateAsync(values)
        }}
      />

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign out of the admin portal?</DialogTitle>
            <DialogDescription>
              You will need to sign in again before managing the directory or
              surveys.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-5">
            <Button
              variant="outline"
              onClick={() => setLogoutOpen(false)}
              disabled={loggingOut}
            >
              Stay signed in
            </Button>
            <Button
              variant="destructive"
              onClick={() => void confirmLogout()}
              disabled={loggingOut}
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
