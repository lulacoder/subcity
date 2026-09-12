import { useState } from 'react'

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

export function PasswordDialog({
  open,
  onOpenChange,
  onChangePassword,
  isSaving,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChangePassword: (values: { currentPassword: string; newPassword: string }) => Promise<void>
  isSaving: boolean
}) {
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = event.currentTarget
    const data = new FormData(form)
    const newPassword = String(data.get('newPassword') ?? '')
    const confirmation = String(data.get('confirmation') ?? '')

    if (newPassword !== confirmation) {
      setError('The new passwords do not match.')
      return
    }

    try {
      await onChangePassword({
        currentPassword: String(data.get('currentPassword') ?? ''),
        newPassword,
      })
      form.reset()
      onOpenChange(false)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not change password.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Other signed-in sessions will be revoked after the password changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <Field>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <Input id="current-password" name="currentPassword" type="password" autoComplete="current-password" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <Input id="new-password" name="newPassword" type="password" autoComplete="new-password" minLength={12} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
              <Input id="confirm-password" name="confirmation" type="password" autoComplete="new-password" minLength={12} required />
            </Field>
            <FieldError>{error}</FieldError>
          </div>
          <DialogFooter className="mt-7">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Changing…' : 'Change password'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
