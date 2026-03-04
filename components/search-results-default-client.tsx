'use client';

import { useState } from 'react';
import type { Product } from '@/lib/api';
import { ProductCard } from './product-card';

interface Props {
  initialProducts: Product[];
  total: number;
}

const PAGE_SIZE = 10;

export function SearchResultsDefaultClient({ initialProducts, total }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [offset, setOffset] = useState(initialProducts.length);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = !exhausted && products.length < total;

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products?limit=${PAGE_SIZE}&skip=${offset}`);

      if (!res.ok) {
        throw new Error(`Failed to load more products (${res.status})`);
      }

const data: { products: Product[]; total: number } = await res.json();
const incoming = data.products ?? [];

if (!incoming.length) return;

setProducts((prev) => {
  const map = new Map(prev.map((p) => [p.id, p]));
  for (const p of incoming) map.set(p.id, p);
  return Array.from(map.values());
});

setOffset((prev) => prev + incoming.length);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {products.length} out of {total} products
      </p>

      {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'See more products'}
          </button>
        </div>
      )}
    </div>
  );
}