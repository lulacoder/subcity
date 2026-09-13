import {
  Facebook01Icon,
  InstagramIcon,
  NewTwitterIcon,
  TiktokIcon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useState } from 'react'

import type { Doc } from '../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const platforms = [
  {
    key: 'facebook',
    label: 'Facebook',
    icon: Facebook01Icon,
    color: 'text-[#1877f2]',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: InstagramIcon,
    color: 'text-[#e1306c]',
    bg: 'bg-pink-50 border-pink-100',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: TiktokIcon,
    color: 'text-neutral-900',
    bg: 'bg-neutral-100 border-neutral-200',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: YoutubeIcon,
    color: 'text-[#ff0000]',
    bg: 'bg-red-50 border-red-100',
  },
  {
    key: 'x',
    label: 'X (Twitter)',
    icon: NewTwitterIcon,
    color: 'text-neutral-950',
    bg: 'bg-neutral-100 border-neutral-200',
  },
] as const

type SocialLinks = Doc<'areas'>['links']

export function LinkEditor({
  area,
  open,
  onOpenChange,
  onSave,
  isSaving,
}: {
  area: Doc<'areas'>
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (links: SocialLinks) => Promise<void>
  isSaving: boolean
}) {
  const [links, setLinks] = useState<SocialLinks>(area.links)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setLinks(area.links)
      setError('')
    }
  }, [area, open])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    try {
      await onSave(links)
      onOpenChange(false)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not save links.',
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-100/70 text-emerald-900 font-bold text-sm">
              {area.type === 'woreda'
                ? area.woredaNumber
                : area.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <DialogTitle className="text-xl font-bold">
                Edit links: {area.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure verified official social media URLs for this area.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-4">
            {platforms.map((platform) => {
              const hasValue = Boolean(links[platform.key])
              return (
                <Field key={platform.key} className="gap-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor={`${area._id}-${platform.key}`}
                      className="flex items-center gap-2 text-xs font-semibold"
                    >
                      <span
                        className={`grid size-6 place-items-center rounded-md border ${platform.bg} ${platform.color}`}
                      >
                        <HugeiconsIcon icon={platform.icon} size={14} />
                      </span>
                      {platform.label}
                    </FieldLabel>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {hasValue ? (
                        <span className="text-emerald-700 font-semibold">
                          ✓ Connected
                        </span>
                      ) : (
                        'Not set'
                      )}
                    </span>
                  </div>
                  <Input
                    id={`${area._id}-${platform.key}`}
                    type="url"
                    placeholder={`https://${platform.key === 'x' ? 'x' : platform.key}.com/...`}
                    value={links[platform.key] ?? ''}
                    className={
                      hasValue ? 'border-emerald-600/40 bg-emerald-50/10' : ''
                    }
                    onChange={(event) =>
                      setLinks((current) => ({
                        ...current,
                        [platform.key]: event.target.value,
                      }))
                    }
                  />
                </Field>
              )
            })}
            <FieldError>{error}</FieldError>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#075a9c] text-white hover:bg-[#0b6eb8] font-semibold"
            >
              {isSaving ? 'Saving…' : 'Save all links'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
