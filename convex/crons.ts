import { cronJobs } from 'convex/server'

import { internal } from './_generated/api'

const crons = cronJobs()

crons.interval(
  'Remove abandoned file uploads',
  { hours: 1 },
  internal.file_cleanup.removeAbandonedUploads,
  {},
)

export default crons
