import {
  AccountSetting01Icon,
  Link01Icon,
  Logout01Icon,
  Menu01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { convexQuery } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useLocation } from '@tanstack/react-router'
import { useMutation as useConvexMutation } from 'convex/react'
import { useState } from 'react'

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
import { authClient } from '@/lib/auth-client'
import '@/admin-modern.css'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const session = authClient.useSession()
  const [navOpen, setNavOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const changePasswordFn = useConvexMutation(api.users.changePassword)
  const changePassword = useMutation({ mutationFn: changePasswordFn })

  if (location.pathname === '/admin/login') return <>{children}</>

  const directoryActive =
    location.pathname === '/admin' || location.pathname.startsWith('/admin/areas')
  const surveysActive = location.pathname.startsWith('/admin/surveys')

  async function confirmLogout() {
    setLoggingOut(true)
    try {
      await authClient.signOut()
      window.location.assign('/admin/login')
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
        <HugeiconsIcon icon={Menu01Icon} size={20} />
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
          <Link className="admin-app-brand" to="/" onClick={() => setNavOpen(false)}>
            <img src="/images/akaki-kality-mark.svg" alt="" aria-hidden="true" />
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
            {(session.data?.user?.name || session.data?.user?.email || 'A')
              .slice(0, 1)
              .toUpperCase()}
          </div>
          <div className="admin-account-copy">
            <strong>{session.data?.user?.name || 'Administrator'}</strong>
            <small>{session.data?.user?.email || 'Private admin account'}</small>
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
              You will need to sign in again before managing the directory or surveys.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-5">
            <Button variant="outline" onClick={() => setLogoutOpen(false)} disabled={loggingOut}>
              Stay signed in
            </Button>
            <Button variant="destructive" onClick={() => void confirmLogout()} disabled={loggingOut}>
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
