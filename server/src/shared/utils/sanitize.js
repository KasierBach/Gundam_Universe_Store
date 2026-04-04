/**
 * Sanitize user input to prevent NoSQL injection
 * Strips $ and . from object keys recursively
 */
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = key.replace(/[\$\.]/g, '');
    sanitized[cleanKey] = sanitizeObject(value);
  }
  return sanitized;
};

/**
 * Strip HTML tags from string to prevent XSS
 * @param {string} str
 * @returns {string}
 */
const stripHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
};

module.exports = { sanitizeObject, stripHtml };
