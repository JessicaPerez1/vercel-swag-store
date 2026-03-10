'use cache';

import { Product } from './api';
const BYPASS_TOKEN = process.env.PROTECTION_BYPASS;
const BASE_URL = 'https://vercel-swag-store-api.vercel.app/api';

export async function getCategories(): Promise<{ slug: string; name: string; url: string }[]> {
  const res = await fetch(`${BASE_URL}/categories`, {
    headers: {
      'x-vercel-protection-bypass': BYPASS_TOKEN!,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  const json = await res.json();

  return (json.data ?? []).map((cat: { slug: string; name: string }) => ({
    slug: cat.slug,
    name: cat.name,
    url: `/search?category=${encodeURIComponent(cat.slug)}`
  }));
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    headers: {
      'x-vercel-protection-bypass': BYPASS_TOKEN!,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  const json = await res.json();
  return json.data;
}