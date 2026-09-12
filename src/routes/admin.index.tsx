import {
  AccountSetting01Icon,
  Edit02Icon,
  Link01Icon,
  Logout01Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { convexQuery } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useMutation as useConvexMutation } from 'convex/react'
import { useMemo, useState } from 'react'

import type { Doc } from '../../convex/_generated/dataModel'
import { api } from '../../convex/_generated/api'
import { CreateWoredaDialog } from '@/components/admin/create-woreda-dialog'
import { LinkEditor } from '@/components/admin/link-editor'
import { PasswordDialog } from '@/components/admin/password-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/admin/')({ component: AdminDashboard })

const platformKeys = ['facebook', 'instagram', 'tiktok', 'youtube', 'x'] as const

function AdminDashboard() {
  const session = authClient.useSession()
  const [editingArea, setEditingArea] = useState<Doc<'areas'> | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  const areasQuery = useQuery({
    ...convexQuery(api.areas.list, {}),
    enabled: Boolean(session.data?.user),
  })

  const updateLinksFn = useConvexMutation(api.areas.updateLinks)
  const createWoredaFn = useConvexMutation(api.areas.createWoreda)
  const changePasswordFn = useConvexMutation(api.users.changePassword)
  const updateLinks = useMutation({ mutationFn: updateLinksFn })
  const createWoreda = useMutation({ mutationFn: createWoredaFn })
  const changePassword = useMutation({ mutationFn: changePasswordFn })

  const areas = useMemo(
    () =>
      [...(areasQuery.data ?? [])].sort((a, b) => {
        const typeOrder = { city: 0, subcity: 1, woreda: 2 }
        return typeOrder[a.type] - typeOrder[b.type] || a.displayOrder - b.displayOrder
      }),
    [areasQuery.data],
  )

  if (session.isPending) return <DashboardSkeleton />
  if (!session.data?.user) return <Navigate to="/admin/login" />

  const role = 'role' in session.data.user ? session.data.user.role : undefined
  if (role !== 'admin') {
    return (
      <main className="admin-shell grid min-h-screen place-items-center p-6">
        <Card className="max-w-md">
          <CardContent className="grid gap-4 text-center">
            <h1 className="text-xl font-semibold">Admin access required</h1>
            <p className="text-muted-foreground">This account cannot open the private directory.</p>
            <Button onClick={() => void authClient.signOut()}>Sign out</Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const totalLinks = areas.reduce(
    (count, area) => count + platformKeys.filter((key) => area.links[key]).length,
    0,
  )
  const woredas = areas.filter((area) => area.type === 'woreda')
  const nextOrder = Math.max(0, ...woredas.map((area) => area.displayOrder)) + 1

  async function signOut() {
    await authClient.signOut()
    window.location.assign('/admin/login')
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <Link className="admin-brand" to="/">
            <span>አቃ</span>
            <div>
              <strong>Akaki Kality</strong>
              <small>Link directory</small>
            </div>
          </Link>
          <nav className="admin-menu">
            <a className="active" href="#directory">
              <HugeiconsIcon icon={Link01Icon} size={19} />
              Directory
            </a>
            <button type="button" onClick={() => setIsPasswordOpen(true)}>
              <HugeiconsIcon icon={AccountSetting01Icon} size={19} />
              Change password
            </button>
          </nav>
        </div>
        <div className="admin-account">
          <div>
            <strong>{session.data.user.name}</strong>
            <small>{session.data.user.email}</small>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Sign out" onClick={() => void signOut()}>
            <HugeiconsIcon icon={Logout01Icon} />
          </Button>
        </div>
      </aside>

      <section className="admin-main" id="directory">
        <header className="admin-main-header">
          <div>
            <p className="admin-overline">Private directory</p>
            <h1>City and woreda links</h1>
            <p>One confirmed URL per platform. Empty links stay private and clearly marked.</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} />
            Add woreda
          </Button>
        </header>

        <div className="admin-stats">
          <div><strong>{areas.length}</strong><span>areas</span></div>
          <div><strong>{woredas.length}</strong><span>woredas</span></div>
          <div><strong>{totalLinks}</strong><span>saved links</span></div>
          <div><strong>{areas.length * 5 - totalLinks}</strong><span>missing links</span></div>
        </div>

        {areasQuery.isPending ? (
          <DirectorySkeleton />
        ) : areasQuery.error ? (
          <div className="admin-error" role="alert">
            {areasQuery.error.message}
          </div>
        ) : (
          <div className="directory-list">
            {areas.map((area) => {
              const savedCount = platformKeys.filter((key) => area.links[key]).length
              return (
                <article className="directory-row" key={area._id}>
                  <div className="area-identity">
                    <span className="area-monogram">
                      {area.type === 'woreda' ? area.woredaNumber : area.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <div className="area-title-line">
                        <h2>{area.name}</h2>
                        <Badge variant="secondary">{area.type}</Badge>
                        {!area.active && <Badge variant="outline">Archived</Badge>}
                      </div>
                      <p>Updated by {area.updatedBy}</p>
                    </div>
                  </div>
                  <div className="platform-status" aria-label={`${savedCount} of 5 links saved`}>
                    {platformKeys.map((key) => (
                      <span
                        key={key}
                        className={`platform-dot${area.links[key] ? ' saved' : ''}`}
                        title={key}
                      >
                        {key === 'x' ? 'X' : key.slice(0, 2).toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <div className="row-actions">
                    <span>{savedCount}/5</span>
                    <Button variant="outline" onClick={() => setEditingArea(area)}>
                      <HugeiconsIcon icon={Edit02Icon} />
                      Edit links
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {editingArea && (
        <LinkEditor
          area={editingArea}
          open={Boolean(editingArea)}
          onOpenChange={(open) => !open && setEditingArea(null)}
          isSaving={updateLinks.isPending}
          onSave={async (links) => {
            await updateLinks.mutateAsync({ areaId: editingArea._id, links })
          }}
        />
      )}

      <CreateWoredaDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isCreating={createWoreda.isPending}
        nextOrder={nextOrder}
        onCreate={async (values) => {
          await createWoreda.mutateAsync(values)
        }}
      />
      <PasswordDialog
        open={isPasswordOpen}
        onOpenChange={setIsPasswordOpen}
        isSaving={changePassword.isPending}
        onChangePassword={async (values) => {
          await changePassword.mutateAsync(values)
        }}
      />
    </main>
  )
}

function DashboardSkeleton() {
  return (
    <main className="admin-shell grid min-h-screen place-items-center p-6">
      <Skeleton className="h-12 w-52" />
    </main>
  )
}

function DirectorySkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  )
}
