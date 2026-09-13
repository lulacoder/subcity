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
  onCreate: (values: {
    name: string
    woredaNumber: number
    displayOrder: number
  }) => Promise<void>
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
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not create woreda.',
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add a new woreda
          </DialogTitle>
          <DialogDescription className="text-xs">
            Add a new woreda district to the Akaki Kality social directory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-4">
            <Field>
              <FieldLabel
                htmlFor="woreda-name"
                className="text-xs font-semibold"
              >
                Woreda Name
              </FieldLabel>
              <Input
                id="woreda-name"
                name="name"
                placeholder="e.g. Woreda 14"
                required
                autoFocus
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="woreda-number"
                  className="text-xs font-semibold"
                >
                  Official Number
                </FieldLabel>
                <Input
                  id="woreda-number"
                  name="number"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="14"
                  required
                />
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="woreda-order"
                  className="text-xs font-semibold"
                >
                  Display Order
                </FieldLabel>
                <Input
                  id="woreda-order"
                  name="order"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={nextOrder}
                  required
                />
              </Field>
            </div>
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
              disabled={isCreating}
              className="bg-[#075a9c] text-white hover:bg-[#0b6eb8] font-semibold"
            >
              {isCreating ? 'Creating…' : 'Create woreda'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
