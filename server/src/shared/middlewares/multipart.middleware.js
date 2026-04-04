const parseMaybeJson = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch (_error) {
      return value;
    }
  }

  return value;
};

const normalizeMultipartFields = (fieldNames = []) => (req, _res, next) => {
  fieldNames.forEach((fieldName) => {
    if (req.body[fieldName] !== undefined) {
      req.body[fieldName] = parseMaybeJson(req.body[fieldName]);
    }
  });

  next();
};

module.exports = { normalizeMultipartFields };
