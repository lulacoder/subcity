import type { QueryCtx, MutationCtx } from '../_generated/server'
import { authComponent } from '../auth'

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.getAuthUser(ctx)

  if (!user || user.role !== 'admin') {
    throw new Error('Admin access is required.')
  }

  return user
}
