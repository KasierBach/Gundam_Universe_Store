export const SITE_NAME = 'Gundam Universe'
export const DEFAULT_SITE_URL = 'https://gundam-universe-store.vercel.app'
export const DEFAULT_OG_IMAGE = '/og-cover.svg'

export const getSiteUrl = () => {
  const envUrl = import.meta.env.VITE_SITE_URL

  if (envUrl) {
    return envUrl.replace(/\/+$/, '')
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '')
  }

  return DEFAULT_SITE_URL
}

export const buildAbsoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}
