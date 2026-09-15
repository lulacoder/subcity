import { useState } from 'react'
import { z } from 'zod'

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

const woredaFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter a woreda name.')
    .max(80, 'Woreda name must be 80 characters or fewer.'),
  number: z.coerce
    .number({ error: 'Enter an official woreda number.' })
    .int('Woreda number must be a whole number.')
    .min(1, 'Woreda number must be at least 1.')
    .max(999, 'Woreda number is too large.'),
  order: z.coerce
    .number({ error: 'Enter a display order.' })
    .int('Display order must be a whole number.')
    .min(1, 'Display order must be at least 1.')
    .max(999, 'Display order is too large.'),
})

type FieldErrors = Partial<Record<'name' | 'number' | 'order' | 'form', string>>

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
  const [errors, setErrors] = useState<FieldErrors>({})

  function clearField(field: keyof FieldErrors) {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})
    const data = new FormData(event.currentTarget)
    const parsed = woredaFormSchema.safeParse({
      name: String(data.get('name') ?? ''),
      number: data.get('number'),
      order: data.get('order'),
    })

    if (!parsed.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (
          (field === 'name' || field === 'number' || field === 'order') &&
          !nextErrors[field]
        ) {
          nextErrors[field] = issue.message
        }
      }
      setErrors(nextErrors)
      return
    }

    try {
      await onCreate({
        name: parsed.data.name,
        woredaNumber: parsed.data.number,
        displayOrder: parsed.data.order,
      })
      onOpenChange(false)
      setErrors({})
    } catch (caughtError) {
      setErrors({
        form:
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not create woreda.',
      })
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
        <form onSubmit={handleSubmit} className="mt-2" noValidate>
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
                maxLength={80}
                aria-invalid={Boolean(errors.name)}
                onChange={() => clearField('name')}
                autoFocus
              />
              <FieldError>{errors.name}</FieldError>
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
                  max="999"
                  step="1"
                  placeholder="14"
                  aria-invalid={Boolean(errors.number)}
                  onChange={() => clearField('number')}
                />
                <FieldError>{errors.number}</FieldError>
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
                  max="999"
                  step="1"
                  defaultValue={nextOrder}
                  aria-invalid={Boolean(errors.order)}
                  onChange={() => clearField('order')}
                />
                <FieldError>{errors.order}</FieldError>
              </Field>
            </div>
            <FieldError>{errors.form}</FieldError>
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
