import { useEffect } from 'react'
import { DEFAULT_OG_IMAGE, SITE_NAME, buildAbsoluteUrl, getSiteUrl } from '../../config/site'

const ensureMetaTag = (selector, createTag) => {
  let tag = document.head.querySelector(selector)

  if (!tag) {
    tag = createTag()
    document.head.appendChild(tag)
  }

  return tag
}

const setMeta = (attribute, key, content) => {
  const selector = `meta[${attribute}="${key}"]`
  const tag = ensureMetaTag(selector, () => {
    const meta = document.createElement('meta')
    meta.setAttribute(attribute, key)
    return meta
  })

  tag.setAttribute('content', content)
}

const setLink = (rel, href) => {
  const selector = `link[rel="${rel}"]`
  const tag = ensureMetaTag(selector, () => {
    const link = document.createElement('link')
    link.setAttribute('rel', rel)
    return link
  })

  tag.setAttribute('href', href)
}

const normalizeJsonLd = (jsonLd) => {
  if (!jsonLd) return null
  return Array.isArray(jsonLd) ? jsonLd : [jsonLd]
}

const SeoHead = ({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  keywords,
  robots = 'index, follow',
  locale = 'vi',
  type = 'website',
  jsonLd,
}) => {
  useEffect(() => {
    const canonicalUrl = buildAbsoluteUrl(path)
    const imageUrl = image.startsWith('http') ? image : `${getSiteUrl()}${image}`
    const localeTag = locale === 'vi' ? 'vi_VN' : 'en_US'
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

    document.title = fullTitle

    setMeta('name', 'description', description)
    setMeta('name', 'keywords', keywords || 'Gundam, Gunpla, marketplace, trade, mecha, model kit')
    setMeta('name', 'robots', robots)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:locale', localeTag)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)
    setLink('canonical', canonicalUrl)

    const normalizedJsonLd = normalizeJsonLd(jsonLd)
    const existingScript = document.getElementById('seo-jsonld')

    if (normalizedJsonLd?.length) {
      const script = existingScript || document.createElement('script')
      script.id = 'seo-jsonld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(normalizedJsonLd.length === 1 ? normalizedJsonLd[0] : normalizedJsonLd)

      if (!existingScript) {
        document.head.appendChild(script)
      }
    } else if (existingScript) {
      existingScript.remove()
    }
  }, [description, image, jsonLd, keywords, locale, path, robots, title, type])

  return null
}

export default SeoHead
