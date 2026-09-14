import { defineApp } from 'convex/server'
import { v } from 'convex/values'

import betterAuth from './betterAuth/convex.config'

const app = defineApp({
  env: {
    SURVEY_API_SECRET: v.optional(v.string()),
  },
})

app.use(betterAuth)

export default app
