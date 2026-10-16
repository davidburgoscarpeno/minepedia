import { existsSync } from 'node:fs';

/**
 * Returns the pixel-icon path for a slug, falling back to a generic
 * section icon when the specific icon does not exist in public/item-icons.
 * Runs at build time (SSG), so the emitted HTML never references a
 * missing asset.
 */
export function iconPath(slug: string, fallback: string): string {
  const p = `/item-icons/${slug}.svg`;
  return existsSync(`public${p}`) ? p : `/item-icons/${fallback}.svg`;
}
