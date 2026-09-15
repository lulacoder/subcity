import {
  AccountSetting01Icon,
  ArrowDown01Icon,
  ArrowRight02Icon,
  Facebook01Icon,
  Globe02Icon,
  InstagramIcon,
  Link01Icon,
  Logout01Icon,
  NewTwitterIcon,
  PlusSignIcon,
  Search01Icon,
  Tick02Icon,
  TiktokIcon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { convexQuery } from '@convex-dev/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from '@tanstack/react-router'
import { useMutation as useConvexMutation } from 'convex/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { api } from '../../convex/_generated/api'
import { CreateWoredaDialog } from '@/components/admin/create-woreda-dialog'
import { PasswordDialog } from '@/components/admin/password-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/admin/')({ component: AdminDashboard })

const platformKeys = [
  'facebook',
  'instagram',
  'tiktok',
  'youtube',
  'x',
] as const

const platformDetails = {
  facebook: { label: 'Facebook', icon: Facebook01Icon, className: 'fb' },
  instagram: { label: 'Instagram', icon: InstagramIcon, className: 'ig' },
  tiktok: { label: 'TikTok', icon: TiktokIcon, className: 'tt' },
  youtube: { label: 'YouTube', icon: YoutubeIcon, className: 'yt' },
  x: { label: 'X', icon: NewTwitterIcon, className: 'x' },
} as const

function AdminDashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = authClient.useSession()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<
    'all' | 'woreda' | 'city' | 'missing'
  >('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const areasQuery = useQuery({
    ...convexQuery(api.areas.list, {}),
    enabled: Boolean(session.data?.user),
  })

  const createWoredaFn = useConvexMutation(api.areas.createWoreda)
  const changePasswordFn = useConvexMutation(api.users.changePassword)
  const createWoreda = useMutation({ mutationFn: createWoredaFn })
  const changePassword = useMutation({ mutationFn: changePasswordFn })

  const areas = useMemo(
    () =>
      [...(areasQuery.data ?? [])].sort((a, b) => {
        const typeOrder = { city: 0, subcity: 1, woreda: 2 }
        return (
          typeOrder[a.type] - typeOrder[b.type] ||
          a.displayOrder - b.displayOrder
        )
      }),
    [areasQuery.data],
  )

  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      const matchesSearch =
        searchTerm === '' ||
        area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (area.woredaNumber && String(area.woredaNumber).includes(searchTerm))

      if (!matchesSearch) return false

      if (filterType === 'woreda') return area.type === 'woreda'
      if (filterType === 'city')
        return area.type === 'city' || area.type === 'subcity'
      if (filterType === 'missing') {
        const saved = platformKeys.filter((k) => area.links[k]).length
        return saved < 5
      }

      return true
    })
  }, [areas, searchTerm, filterType])

  if (session.isPending) return <DashboardSkeleton />
  if (!session.data?.user) return <Navigate to="/admin/login" />

  const role = 'role' in session.data.user ? session.data.user.role : undefined
  if (role !== 'admin') {
    return (
      <main className="admin-shell grid min-h-screen place-items-center p-6">
        <Card className="max-w-md">
          <CardContent className="grid gap-4 text-center">
            <h1 className="text-xl font-semibold">Admin access required</h1>
            <p className="text-muted-foreground">
              This account cannot open the private directory.
            </p>
            <Button onClick={() => void authClient.signOut()}>Sign out</Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const totalLinks = areas.reduce(
    (count, area) =>
      count + platformKeys.filter((key) => area.links[key]).length,
    0,
  )
  const woredas = areas.filter((area) => area.type === 'woreda')
  const nextOrder = Math.max(0, ...woredas.map((area) => area.displayOrder)) + 1

  async function signOut() {
    await authClient.signOut()
    queryClient.clear()
    await navigate({ to: '/admin/login', replace: true })
  }

  return (
    <main className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div>
          <Link className="admin-brand" to="/">
            <span>አቃ</span>
            <div>
              <strong>Akaki Kality</strong>
              <small>Civic Portal Directory</small>
            </div>
          </Link>

          <nav className="admin-menu">
            <a className="active" href="#directory">
              <HugeiconsIcon icon={Link01Icon} size={18} />
              Directory &amp; Links
            </a>
            <Link to="/admin/surveys">
              <HugeiconsIcon icon={Globe02Icon} size={18} />
              Surveys
            </Link>
            <button type="button" onClick={() => setIsPasswordOpen(true)}>
              <HugeiconsIcon icon={AccountSetting01Icon} size={18} />
              Change password
            </button>
          </nav>
        </div>

        <div className="admin-account">
          <div>
            <strong>{session.data.user.name}</strong>
            <small>{session.data.user.email}</small>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Sign out"
            title="Sign out"
            onClick={() => void signOut()}
          >
            <HugeiconsIcon icon={Logout01Icon} size={17} />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="admin-main" id="directory">
        <header className="admin-main-header">
          <div>
            <p className="admin-overline">Verified Registry</p>
            <h1>Social Media Directory</h1>
            <p>
              Manage confirmed public links across all woredas and civic sectors
              in Akaki Kality. Click any woreda to view its dedicated details
              and manage channels.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-sm"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Add Woreda
          </Button>
        </header>

        {/* Executive Stats Cards */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Total Entities</span>
            <strong>{areas.length}</strong>
            <small className="text-xs text-muted-foreground">
              City, subcity &amp; woredas
            </small>
          </div>
          <div className="admin-stat-card">
            <span>Active Woredas</span>
            <strong>{woredas.length}</strong>
            <small className="text-xs text-muted-foreground">
              Sub-city districts
            </small>
          </div>
          <div className="admin-stat-card">
            <span>Verified Links</span>
            <strong className="text-blue-700">{totalLinks}</strong>
            <small className="text-xs text-muted-foreground">
              {Math.round((totalLinks / (areas.length * 5 || 1)) * 100)}%
              coverage
            </small>
          </div>
          <div className="admin-stat-card">
            <span>Missing Links</span>
            <strong className="text-amber-700">
              {areas.length * 5 - totalLinks}
            </strong>
            <small className="text-xs text-muted-foreground">
              Platforms left to verify
            </small>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="search"
              placeholder="Search woreda name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white border-blue-200 focus:border-blue-600 focus:ring-blue-500/20"
            />
          </div>

          {/* Capsule Filter Dropdown */}
          <div className="admin-filter-dropdown-wrap" ref={filterDropdownRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="admin-filter-dropdown-trigger"
              aria-expanded={isFilterOpen}
              aria-haspopup="true"
            >
              <HugeiconsIcon
                icon={Globe02Icon}
                size={15}
                className="text-blue-700"
              />
              <span>
                Filter:{' '}
                <strong className="text-blue-950 font-semibold">
                  {filterType === 'all'
                    ? 'All Areas'
                    : filterType === 'woreda'
                      ? 'Woredas'
                      : filterType === 'city'
                        ? 'City / Sub-city'
                        : 'Needs Links'}
                </strong>
              </span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={14}
                className={`transition-transform duration-200 text-muted-foreground ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="admin-filter-dropdown-menu" role="menu">
                {(
                  [
                    { key: 'all', label: 'All Areas' },
                    { key: 'woreda', label: 'Woredas Only' },
                    { key: 'city', label: 'City & Sub-city' },
                    { key: 'missing', label: 'Needs Links (< 5)' },
                  ] as const
                ).map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    role="menuitem"
                    data-active={filterType === filter.key}
                    onClick={() => {
                      setFilterType(filter.key)
                      setIsFilterOpen(false)
                    }}
                    className="admin-filter-dropdown-item"
                  >
                    <span>{filter.label}</span>
                    {filterType === filter.key && (
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        size={14}
                        className="text-blue-700"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Directory Listing */}
        {areasQuery.isPending ? (
          <DirectorySkeleton />
        ) : areasQuery.error ? (
          <div className="admin-error" role="alert">
            {areasQuery.error.message}
          </div>
        ) : filteredAreas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-12 text-center">
            <HugeiconsIcon
              icon={Globe02Icon}
              size={36}
              className="mx-auto text-blue-300 mb-3"
            />
            <h3 className="font-semibold text-lg text-blue-950">
              No areas found
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search query or filter selection.
            </p>
          </div>
        ) : (
          <div className="directory-list">
            {filteredAreas.map((area) => {
              const savedCount = platformKeys.filter(
                (key) => area.links[key],
              ).length
              const isComplete = savedCount === 5

              return (
                <article
                  className="directory-row group cursor-pointer"
                  key={area._id}
                  onClick={() =>
                    void navigate({
                      to: '/admin/areas/$id',
                      params: { id: area._id },
                    })
                  }
                >
                  <div className="area-identity">
                    <span className="area-monogram">
                      {area.type === 'woreda'
                        ? area.woredaNumber
                        : area.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <div className="area-title-line">
                        <h2 className="group-hover:text-blue-700 transition-colors">
                          {area.name}
                        </h2>
                        <Badge variant="secondary" className="capitalize">
                          {area.type}
                        </Badge>
                        {!area.active && (
                          <Badge variant="outline">Archived</Badge>
                        )}
                        {isComplete && (
                          <Badge
                            variant="default"
                            className="bg-blue-700 text-white text-[10px]"
                          >
                            Complete
                          </Badge>
                        )}
                      </div>
                      <p>Last edited by {area.updatedBy}</p>
                    </div>
                  </div>

                  {/* Visual Branded Platform Status with direct new-tab click support */}
                  <div
                    className="platform-status"
                    aria-label={`${savedCount} of 5 links confirmed`}
                  >
                    {platformKeys.map((key) => {
                      const platform = platformDetails[key]
                      const savedUrl = area.links[key]
                      const isSaved = Boolean(savedUrl)

                      if (isSaved) {
                        return (
                          <a
                            key={key}
                            href={savedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`platform-dot saved ${platform.className}`}
                            title={`${platform.label}: Connected (Click to open in new tab)`}
                          >
                            <HugeiconsIcon icon={platform.icon} size={16} />
                          </a>
                        )
                      }

                      return (
                        <span
                          key={key}
                          className="platform-dot"
                          title={`${platform.label}: Not configured`}
                        >
                          <HugeiconsIcon icon={platform.icon} size={16} />
                        </span>
                      )
                    })}
                  </div>

                  <div className="row-actions">
                    <span className="saved-count">
                      <span
                        className={
                          savedCount > 0
                            ? 'text-blue-700 font-bold'
                            : 'text-muted-foreground'
                        }
                      >
                        {savedCount}
                      </span>
                      <span className="text-muted-foreground">/5 links</span>
                    </span>

                    {/* Dedicated Detail Page Navigation Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link to="/admin/areas/$id" params={{ id: area._id }} />
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="border-blue-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-900 text-xs font-semibold gap-1.5"
                    >
                      <span>View Details</span>
                      <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <CreateWoredaDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isCreating={createWoreda.isPending}
        nextOrder={nextOrder}
        onCreate={async (values) => {
          const newId = await createWoreda.mutateAsync(values)
          if (newId) {
            void navigate({
              to: '/admin/areas/$id',
              params: { id: newId },
            })
          }
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
      <Skeleton className="h-12 w-52 rounded-xl" />
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
