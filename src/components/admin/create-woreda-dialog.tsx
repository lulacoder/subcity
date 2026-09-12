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

export function CreateWoredaDialog({
  open,
  onOpenChange,
  onCreate,
  isCreating,
  nextOrder,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (values: { name: string; woredaNumber: number; displayOrder: number }) => Promise<void>
  isCreating: boolean
  nextOrder: number
}) {
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const data = new FormData(event.currentTarget)

    try {
      await onCreate({
        name: String(data.get('name') ?? '').trim(),
        woredaNumber: Number(data.get('number')),
        displayOrder: Number(data.get('order')),
      })
      onOpenChange(false)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not create woreda.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a woreda</DialogTitle>
          <DialogDescription>
            The official number and display order can differ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <Field>
              <FieldLabel htmlFor="woreda-name">Name</FieldLabel>
              <Input id="woreda-name" name="name" placeholder="Woreda 14" required autoFocus />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="woreda-number">Official number</FieldLabel>
                <Input id="woreda-number" name="number" type="number" min="1" step="1" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="woreda-order">Display order</FieldLabel>
                <Input id="woreda-order" name="order" type="number" min="1" step="1" defaultValue={nextOrder} required />
              </Field>
            </div>
            <FieldError>{error}</FieldError>
          </div>
          <DialogFooter className="mt-7">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating…' : 'Create woreda'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
