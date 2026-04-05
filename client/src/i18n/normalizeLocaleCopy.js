const mojibakePattern = /(?:Ã.|Ä.|á.|Â.|Æ.)/

const decodeMojibake = (value) => {
  if (typeof value !== 'string' || !mojibakePattern.test(value)) {
    return value
  }

  try {
    const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0))
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    return value
  }
}

export const normalizeLocaleCopy = (input) => {
  if (Array.isArray(input)) {
    return input.map(normalizeLocaleCopy)
  }

  if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, normalizeLocaleCopy(value)])
    )
  }

  return decodeMojibake(input)
}

export default normalizeLocaleCopy
