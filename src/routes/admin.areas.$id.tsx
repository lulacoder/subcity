import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  ExternalLinkIcon,
  Facebook01Icon,
  Globe02Icon,
  InstagramIcon,
  Link01Icon,
  NewTwitterIcon,
  Settings02Icon,
  Tick02Icon,
  TiktokIcon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { convexQuery } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useMutation as useConvexMutation } from 'convex/react'
import { useEffect, useMemo, useState } from 'react'


import { api } from '../../convex/_generated/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/admin/areas/$id')({
  component: AdminAreaDetailPage,
})

const platformKeys = [
  'facebook',
  'instagram',
  'tiktok',
  'youtube',
  'x',
] as const

type PlatformKey = (typeof platformKeys)[number]

const platformMeta: Record<
  PlatformKey,
  {
    label: string
    icon: typeof Facebook01Icon
    placeholder: string
    color: string
    accentBg: string
    borderColor: string
    textColor: string
    badgeBg: string
    helper: string
  }
> = {
  facebook: {
    label: 'Facebook',
    icon: Facebook01Icon,
    placeholder: 'https://facebook.com/akaki.kality.official',
    color: '#1877f2',
    accentBg: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-600',
    badgeBg: 'bg-blue-600 text-white',
    helper: 'Official Facebook page or group link',
  },
  instagram: {
    label: 'Instagram',
    icon: InstagramIcon,
    placeholder: 'https://instagram.com/akaki_kality',
    color: '#e1306c',
    accentBg: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-600',
    badgeBg: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    helper: 'Official Instagram profile handle URL',
  },
  tiktok: {
    label: 'TikTok',
    icon: TiktokIcon,
    placeholder: 'https://tiktok.com/@akakikality',
    color: '#0f172a',
    accentBg: 'bg-slate-900/10',
    borderColor: 'border-slate-800/30',
    textColor: 'text-slate-900',
    badgeBg: 'bg-slate-900 text-white',
    helper: 'Official verified TikTok account',
  },
  youtube: {
    label: 'YouTube',
    icon: YoutubeIcon,
    placeholder: 'https://youtube.com/@akakikality',
    color: '#ff0000',
    accentBg: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-600',
    badgeBg: 'bg-red-600 text-white',
    helper: 'Official YouTube broadcast channel',
  },
  x: {
    label: 'X (Twitter)',
    icon: NewTwitterIcon,
    placeholder: 'https://x.com/akakikality',
    color: '#0f1419',
    accentBg: 'bg-neutral-900/10',
    borderColor: 'border-neutral-800/30',
    textColor: 'text-neutral-900',
    badgeBg: 'bg-black text-white',
    helper: 'Official X/Twitter communication handle',
  },
}

function AdminAreaDetailPage() {
  const { id } = Route.useParams()
  const session = authClient.useSession()

  const allAreasQuery = useQuery({
    ...convexQuery(api.areas.list, {}),
    enabled: Boolean(session.data?.user),
  })

  const updateLinksFn = useConvexMutation(api.areas.updateLinks)
  const updateWoredaFn = useConvexMutation(api.areas.updateWoreda)

  const updateLinks = useMutation({ mutationFn: updateLinksFn })
  const updateWoreda = useMutation({ mutationFn: updateWoredaFn })

  const area = allAreasQuery.data?.find((item) => item._id === id)

  // Form local states for links
  const [links, setLinks] = useState<Record<PlatformKey, string>>({
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    x: '',
  })
  const [saveLinksSuccess, setSaveLinksSuccess] = useState(false)
  const [linksError, setLinksError] = useState('')

  // Form local states for woreda settings
  const [woredaName, setWoredaName] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)
  const [isActive, setIsActive] = useState(true)
  const [saveWoredaSuccess, setSaveWoredaSuccess] = useState(false)
  const [woredaError, setWoredaError] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Sync state when area loads
  useEffect(() => {
    if (area) {
      setLinks({
        facebook: area.links.facebook ?? '',
        instagram: area.links.instagram ?? '',
        tiktok: area.links.tiktok ?? '',
        youtube: area.links.youtube ?? '',
        x: area.links.x ?? '',
      })
      setWoredaName(area.name)
      setDisplayOrder(area.displayOrder)
      setIsActive(area.active)
    }
  }, [area])

  // Sorted areas for previous / next navigation
  const sortedAreas = useMemo(() => {
    return [...(allAreasQuery.data ?? [])].sort((a, b) => {
      const typeOrder = { city: 0, subcity: 1, woreda: 2 }
      return (
        typeOrder[a.type] - typeOrder[b.type] ||
        a.displayOrder - b.displayOrder
      )
    })
  }, [allAreasQuery.data])

  const currentIndex = sortedAreas.findIndex((a) => a._id === id)
  const prevArea = currentIndex > 0 ? sortedAreas[currentIndex - 1] : null
  const nextArea =
    currentIndex >= 0 && currentIndex < sortedAreas.length - 1
      ? sortedAreas[currentIndex + 1]
      : null

  if (session.isPending) {
    return <AreaDetailSkeleton />
  }

  if (!session.data?.user) {
    return <Navigate to="/admin/login" />
  }

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

  if (allAreasQuery.isPending) {
    return <AreaDetailSkeleton />
  }

  if (allAreasQuery.error) {
    return (
      <main className="admin-shell min-h-screen p-8">
        <div className="mx-auto max-w-3xl text-center py-20">
          <h2 className="text-2xl font-bold text-blue-950 mb-3">Unable to load this area</h2>
          <p className="text-muted-foreground mb-6">{allAreasQuery.error.message}</p>
          <Button onClick={() => void allAreasQuery.refetch()} className="bg-blue-700 hover:bg-blue-800 text-white">
            Try again
          </Button>
        </div>
      </main>
    )
  }

  if (!area) {
    return (
      <main className="admin-shell min-h-screen p-8">
        <div className="mx-auto max-w-3xl text-center py-20">
          <h2 className="text-2xl font-bold text-blue-950 mb-3">Area Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The requested woreda or administrative division does not exist or has been removed.
          </p>
          <Button
            render={<Link to="/admin" />}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
            Back to Directory Dashboard
          </Button>
        </div>
      </main>
    )
  }

  const verifiedCount = platformKeys.filter((k) => links[k].trim()).length

  const handleLinkChange = (key: PlatformKey, val: string) => {
    setLinks((prev) => ({ ...prev, [key]: val }))
    setSaveLinksSuccess(false)
    setLinksError('')
  }

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault()
    setLinksError('')
    setSaveLinksSuccess(false)

    try {
      await updateLinks.mutateAsync({
        areaId: area._id,
        links: {
          facebook: links.facebook.trim() || undefined,
          instagram: links.instagram.trim() || undefined,
          tiktok: links.tiktok.trim() || undefined,
          youtube: links.youtube.trim() || undefined,
          x: links.x.trim() || undefined,
        },
      })
      setSaveLinksSuccess(true)
      setTimeout(() => setSaveLinksSuccess(false), 4000)
    } catch (err) {
      setLinksError(err instanceof Error ? err.message : 'Failed to save links.')
    }
  }

  const handleSaveWoredaSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setWoredaError('')
    setSaveWoredaSuccess(false)

    try {
      await updateWoreda.mutateAsync({
        areaId: area._id,
        name: woredaName.trim(),
        displayOrder,
        active: isActive,
      })
      setSaveWoredaSuccess(true)
      setTimeout(() => setSaveWoredaSuccess(false), 4000)
    } catch (err) {
      setWoredaError(
        err instanceof Error ? err.message : 'Failed to update woreda settings.',
      )
    }
  }

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="admin-detail-layout min-h-screen bg-[#f7fafc] text-neutral-900">
      {/* Top Breadcrumb & Quick Switch Bar */}
      <header className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/90 backdrop-blur-md px-6 py-3.5">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-blue-700 transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
              <span>Back to Directory</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-sm font-semibold text-blue-950">
              {area.name}
            </span>
          </div>

          {/* Quick prev/next jumper */}
          <div className="flex items-center gap-2">
            {prevArea && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                render={<Link to="/admin/areas/$id" params={{ id: prevArea._id }} />}
                title={`Go to ${prevArea.name}`}
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={13} />
                <span className="hidden sm:inline">Prev</span>
              </Button>
            )}

            <span className="text-xs text-neutral-400 font-mono px-1">
              {currentIndex + 1} of {sortedAreas.length}
            </span>

            {nextArea && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                render={<Link to="/admin/areas/$id" params={{ id: nextArea._id }} />}
                title={`Go to ${nextArea.name}`}
              >
                <span className="hidden sm:inline">Next</span>
                <HugeiconsIcon icon={ArrowRight02Icon} size={13} />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#062a4a] via-[#073b68] to-[#062a4a] text-white px-6 py-10 shadow-lg border-b border-blue-950">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border-2 border-blue-500/40 text-blue-200 flex items-center justify-center text-xl font-extrabold shadow-inner">
              {area.type === 'woreda'
                ? area.woredaNumber
                : area.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs uppercase tracking-widest font-semibold text-blue-300">
                  {area.type} Entity
                </span>
                <Badge
                  variant="secondary"
                  className={
                    area.active
                      ? 'bg-blue-500/20 text-blue-200 border-blue-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }
                >
                  {area.active ? 'Active' : 'Archived'}
                </Badge>
                {verifiedCount === 5 ? (
                  <Badge className="bg-emerald-600 text-white border-none gap-1">
                    <HugeiconsIcon icon={Tick02Icon} size={12} />
                    All 5 Channels Configured
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/20 text-amber-200 border border-amber-500/30">
                    {verifiedCount} of 5 Channels Linked
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
                {area.name}
              </h1>
              <p className="text-xs text-blue-200/70 mt-1">
                Last modified by {area.updatedBy} •{' '}
                {new Date(area.updatedAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const firstLink = Object.values(links).find((url) => Boolean(url.trim()))
                if (firstLink) window.open(firstLink, '_blank', 'noopener,noreferrer')
              }}
              disabled={verifiedCount === 0}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              <HugeiconsIcon icon={ExternalLinkIcon} size={15} />
              Test First Available Link
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Social Media Channels (The core feature) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-blue-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-blue-50/80 bg-blue-50/30 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-lg font-bold text-blue-950 flex items-center gap-2">
                    <HugeiconsIcon icon={Link01Icon} size={20} className="text-blue-600" />
                    Verified Social Channels
                  </CardTitle>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Click "Open Link" to inspect any channel in a new tab. Update URLs and click Save.
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100/80 text-blue-800">
                  {verifiedCount} / 5 Active
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSaveLinks} className="space-y-5">
                {linksError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {linksError}
                  </div>
                )}

                {saveLinksSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-emerald-600" />
                    Links updated successfully! Changes are live across the system.
                  </div>
                )}

                <div className="space-y-4">
                  {platformKeys.map((key) => {
                    const meta = platformMeta[key]
                    const currentVal = links[key] || ''
                    const hasLink = Boolean(currentVal.trim())

                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-xl border transition-all ${
                          hasLink
                            ? 'border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                            : 'border-dashed border-neutral-200 bg-neutral-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{ backgroundColor: meta.color }}
                            >
                              <HugeiconsIcon icon={meta.icon} size={17} />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-neutral-900">
                                {meta.label}
                              </span>
                              <span className="block text-[11px] text-neutral-400">
                                {meta.helper}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {hasLink && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(currentVal, key)}
                                  className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors text-xs flex items-center gap-1"
                                  title="Copy URL"
                                >
                                  <HugeiconsIcon
                                    icon={copiedKey === key ? Tick02Icon : Copy01Icon}
                                    size={14}
                                    className={copiedKey === key ? 'text-emerald-600' : ''}
                                  />
                                </button>
                                {/* Critical requirement: Links MUST open on a new page when clicked */}
                                <a
                                  href={currentVal}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm"
                                  title={`Open ${meta.label} in a new tab`}
                                >
                                  <span>Open Link</span>
                                  <HugeiconsIcon icon={ExternalLinkIcon} size={12} />
                                </a>
                              </>
                            )}
                            {!hasLink && (
                              <span className="text-[11px] font-medium text-neutral-400 italic">
                                Not configured
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="relative">
                          <Input
                            type="url"
                            value={currentVal}
                            placeholder={meta.placeholder}
                            onChange={(e) => handleLinkChange(key, e.target.value)}
                            className="text-xs font-mono h-9 pr-8 bg-white border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20"
                          />
                          {hasLink && (
                            <button
                              type="button"
                              onClick={() => handleLinkChange(key, '')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                              title="Clear URL"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    All URLs are verified against official platform formats.
                  </span>
                  <Button
                    type="submit"
                    disabled={updateLinks.isPending}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 shadow-sm"
                  >
                    {updateLinks.isPending ? 'Saving...' : 'Save All Links'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Entity Settings & Metadata */}
        <div className="space-y-6">
          {/* Quick Details Card */}
          <Card className="border-blue-100 shadow-sm bg-white">
            <CardHeader className="border-b border-blue-50/80 bg-blue-50/20 pb-3">
              <CardTitle className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <HugeiconsIcon icon={Globe02Icon} size={16} className="text-blue-600" />
                Administrative Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Classification</span>
                <span className="font-semibold text-neutral-800 capitalize">{area.type}</span>
              </div>
              {area.woredaNumber && (
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500">Woreda Number</span>
                  <span className="font-mono font-semibold text-blue-900">
                    District #{area.woredaNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Display Order</span>
                <span className="font-mono font-semibold text-neutral-800">
                  {area.displayOrder}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Active Status</span>
                <span className={`font-semibold ${area.active ? 'text-emerald-700' : 'text-neutral-500'}`}>
                  {area.active ? 'Public & Active' : 'Archived'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Last Updated By</span>
                <span className="font-medium text-neutral-700 truncate max-w-[150px]">
                  {area.updatedBy}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Area Configuration (For woredas) */}
          {area.type === 'woreda' && (
            <Card className="border-blue-100 shadow-sm bg-white">
              <CardHeader className="border-b border-blue-50/80 bg-blue-50/20 pb-3">
                <CardTitle className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <HugeiconsIcon icon={Settings02Icon} size={16} className="text-blue-600" />
                  Woreda Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleSaveWoredaSettings} className="space-y-4">
                  {woredaError && (
                    <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs">
                      {woredaError}
                    </div>
                  )}
                  {saveWoredaSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5">
                      <HugeiconsIcon icon={Tick02Icon} size={14} className="text-emerald-600" />
                      Settings updated!
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Woreda Name
                    </label>
                    <Input
                      type="text"
                      value={woredaName}
                      onChange={(e) => setWoredaName(e.target.value)}
                      className="text-xs h-9"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Display Sequence
                    </label>
                    <Input
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value))}
                      className="text-xs h-9 font-mono"
                      min={1}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isActiveCheckbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <label htmlFor="isActiveCheckbox" className="text-xs font-medium text-neutral-700 cursor-pointer">
                      Active and visible in directory
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateWoreda.isPending}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs h-9 font-semibold"
                  >
                    {updateWoreda.isPending ? 'Updating...' : 'Update Settings'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Quick Woreda Directory Navigator */}
          <Card className="border-blue-100 shadow-sm bg-white">
            <CardHeader className="border-b border-blue-50/80 bg-blue-50/20 pb-3">
              <CardTitle className="text-sm font-bold text-blue-950">
                All Woredas Quick Switch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 max-h-60 overflow-y-auto space-y-1">
              {sortedAreas.map((item) => (
                <Link
                  key={item._id}
                  to="/admin/areas/$id"
                  params={{ id: item._id }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    item._id === area._id
                      ? 'bg-blue-100 text-blue-950 font-bold'
                      : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  <span className="text-[10px] opacity-70">
                    {platformKeys.filter((k) => item.links[k]).length}/5
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function AreaDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7fafc] p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
