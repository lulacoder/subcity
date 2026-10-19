import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['convex/**/*.test.ts'],
    environment: 'edge-runtime',
    server: { deps: { inline: ['convex-test'] } },
    env: {
      CONVEX_SITE_URL: 'https://test.convex.site',
      CONVEX_CLOUD_URL: 'https://test.convex.cloud',
      BETTER_AUTH_SECRET: 'convex-lint-regression-tests-secret',
    },
  },
})
