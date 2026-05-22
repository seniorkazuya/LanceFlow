import { describe, expect, it } from 'vitest';
import { listSopCategories, SOP_CATALOG } from '@lanceflow/operations';

describe('SOP catalog (OPS-007)', () => {
  it('exposes categories with items', () => {
    const categories = listSopCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const cat of categories) {
      expect(cat.label.length).toBeGreaterThan(0);
      expect(cat.items.length).toBeGreaterThan(0);
      for (const item of cat.items) {
        expect(item.href).toMatch(/^https:\/\//);
      }
    }
  });

  it('includes delivery and onboarding sections', () => {
    const ids = listSopCategories().map((c) => c.id);
    expect(ids).toContain('onboarding');
    expect(ids).toContain('delivery');
  });

  it('catalog is immutable source', () => {
    expect(SOP_CATALOG.length).toBeGreaterThanOrEqual(4);
  });
});
