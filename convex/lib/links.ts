export const platformDomains = {
  facebook: ['facebook.com', 'www.facebook.com', 'm.facebook.com'],
  instagram: ['instagram.com', 'www.instagram.com'],
  tiktok: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'],
  youtube: ['youtube.com', 'www.youtube.com', 'youtu.be'],
  x: ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'],
} as const

export type Platform = keyof typeof platformDomains

export function validatePlatformUrl(platform: Platform, value: string) {
  const normalized = value.trim()

  if (!normalized) return ''

  let url: URL
  try {
    url = new URL(normalized)
  } catch {
    throw new Error(`Enter a complete ${platform} URL.`)
  }

  if (url.protocol !== 'https:') {
    throw new Error(`${platform} links must use https.`)
  }

  const allowedDomains: readonly string[] = platformDomains[platform]
  if (!allowedDomains.includes(url.hostname.toLowerCase())) {
    throw new Error(`This is not a recognized ${platform} URL.`)
  }

  return url.toString()
}
