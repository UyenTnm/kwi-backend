export function simpleSlugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export const toBool = (v: any): boolean =>
  [true, 'true', 1, '1', 'on', 'yes'].includes(v);
