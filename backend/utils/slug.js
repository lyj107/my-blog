function createSlug(value, fallback = 'item') {
  const base = String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || fallback;
}

function createUniqueSlug(value, fallback = 'item') {
  return `${createSlug(value, fallback)}-${Date.now()}`;
}

module.exports = {
  createSlug,
  createUniqueSlug
};
