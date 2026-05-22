import { SOP_CATALOG, type SopCategory, type SopLink } from './catalog';

export type { SopCategory, SopLink };
export { SOP_CATALOG };

/** SOP categories with at least one item, sorted by label. */
export function listSopCategories(): SopCategory[] {
  return SOP_CATALOG.map((category) => ({
    ...category,
    items: [...category.items],
  })).filter((c) => c.items.length > 0);
}
