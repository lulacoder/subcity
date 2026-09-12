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
  { key: 'facebook', label: 'Facebook', icon: Facebook01Icon },
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', icon: TiktokIcon },
  { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
  { key: 'x', label: 'X', icon: NewTwitterIcon },
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
      setError(caughtError instanceof Error ? caughtError.message : 'Could not save links.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit links for {area.name}</DialogTitle>
          <DialogDescription>
            Leave a field empty when that platform has no confirmed link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            {platforms.map((platform) => (
              <Field key={platform.key}>
                <FieldLabel htmlFor={`${area._id}-${platform.key}`}>
                  <HugeiconsIcon icon={platform.icon} size={18} />
                  {platform.label}
                </FieldLabel>
                <Input
                  id={`${area._id}-${platform.key}`}
                  type="url"
                  placeholder={`https://${platform.key}.com/...`}
                  value={links[platform.key] ?? ''}
                  onChange={(event) =>
                    setLinks((current) => ({
                      ...current,
                      [platform.key]: event.target.value,
                    }))
                  }
                />
              </Field>
            ))}
            <FieldError>{error}</FieldError>
          </div>
          <DialogFooter className="mt-7">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save links'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
