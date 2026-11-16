import { afterEach, expect, test, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

test('reports to EU Cloud with the project token', async () => {
  vi.stubEnv('VITE_POSTHOG_KEY', ' phc_test ')
  const { bundledPostHog } = await import('./posthog')
  expect(bundledPostHog).toEqual({
    projectToken: 'phc_test',
    host: 'https://eu.i.posthog.com',
    uiHost: 'https://eu.posthog.com',
    assetsHost: 'https://eu-assets.i.posthog.com',
  })
})

test.each(['', '   '])('stays off with the project token %j', async (token) => {
  vi.stubEnv('VITE_POSTHOG_KEY', token)
  const { bundledPostHog } = await import('./posthog')
  expect(bundledPostHog).toBeUndefined()
})
