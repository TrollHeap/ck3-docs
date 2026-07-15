export const langs = ['en', 'fr', 'es'];

export function cleanBase() {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export function withBase(path) {
  const base = cleanBase();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function langPath(lang, section = 'docs', id = '') {
  if (section === 'recipes' && id) return withBase(`/${lang}/recipes/${id}/`);
  return withBase(`/${lang}/${section}/`);
}
