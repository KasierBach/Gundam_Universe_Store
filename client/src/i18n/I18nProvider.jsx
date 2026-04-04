import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const STORAGE_KEY = 'gundam-universe-locale'
const LOCALES = ['vi', 'en']

const I18nContext = createContext(null)

const getInitialLocale = () => {
  if (typeof window === 'undefined') {
    return 'vi'
  }

  const storedLocale = window.localStorage.getItem(STORAGE_KEY)
  if (LOCALES.includes(storedLocale)) {
    return storedLocale
  }

  return 'vi'
}

const getNestedValue = (source, path) => path.split('.').reduce((value, segment) => value?.[segment], source)

const interpolate = (template, params = {}) =>
  template.replace(/\{(\w+)\}/g, (_, key) => (params[key] ?? `{${key}}`))

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(getInitialLocale)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale)
      document.documentElement.lang = locale
    }
  }, [locale])

  const value = useMemo(() => {
    const dictionary = translations[locale] || translations.en

    const t = (path, params = {}, fallback = path) => {
      const match = getNestedValue(dictionary, path) ?? getNestedValue(translations.en, path)
      if (typeof match !== 'string') {
        return fallback
      }
      return interpolate(match, params)
    }

    const tv = (namespace, key) => {
      if (!key) return key
      return dictionary.enums?.[namespace]?.[key] ?? translations.en.enums?.[namespace]?.[key] ?? key
    }

    const toggleLocale = () => setLocale((current) => (current === 'vi' ? 'en' : 'vi'))

    return {
      locale,
      setLocale,
      toggleLocale,
      t,
      tv,
      isVietnamese: locale === 'vi',
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
