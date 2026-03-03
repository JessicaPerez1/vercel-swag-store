const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS;

function getBaseUrl(): string {
  const value =
    process.env.BASE_URL ||
    '';

  if (!value) {
    throw new Error('Missing BASE_URL in environment variables');
  }

  return value.replace(/\/+$/, '');
}


export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  currency: string
  category: string
  images: string[],
  tags: string[]
  featured: boolean
  createdAt: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  if (BYPASS_TOKEN) headers['x-vercel-protection-bypass'] = BYPASS_TOKEN;
  return headers;
}

async function apiFetch(path: string, init?: RequestInit) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText} (${path})`);
  }

  return res.json();
}

function getProductsArray(json: any): Product[] {
  if (Array.isArray(json?.data)) return json.data as Product[];
  if (Array.isArray(json?.data?.products)) return json.data.products as Product[];
  if (Array.isArray(json?.products)) return json.products as Product[];
  if (Array.isArray(json)) return json as Product[];
  return [];
}

function getTotalCount(json: any, products: Product[]): number {
  const total =
    (typeof json?.meta?.pagination?.total === 'number' && json.meta.pagination.total) ||
    (typeof json?.total === 'number' && json.total) ||
    (typeof json?.data?.total === 'number' && json.data.total) ||
    (typeof json?.meta?.total === 'number' && json.meta.total) ||
    (typeof json?.pagination?.total === 'number' && json.pagination.total);

  return typeof total === 'number' ? total : products.length;
}

export async function getProducts(limit = 30, skip = 0): Promise<ProductsResponse> {
  const json = await apiFetch(`/products?limit=${limit}&skip=${skip}`);
  const products = getProductsArray(json);

  return {
    products,
    total: getTotalCount(json, products),
    skip,
    limit,
  };
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const json = await apiFetch('/products?limit=100&skip=0');
  return getProductsArray(json)
    .filter((product) => product.featured === true)
    .slice(0, limit);
}

export async function searchProducts(
  query = '',
  limit = 5,
  skip = 0,
  category?: string,
): Promise<ProductsResponse> {
  const json = await apiFetch('/products?limit=100&skip=0');
  const allProducts = getProductsArray(json);

  const q = query.trim().toLowerCase();
  const categoryFilter = category?.trim().toLowerCase();

  // Category-only mode (no search text)
  if (!q) {
    const base = categoryFilter
      ? allProducts.filter((p) => (p.category ?? '').toLowerCase() === categoryFilter)
      : allProducts;

    return {
      products: base.slice(skip, skip + limit),
      total: base.length,
      skip,
      limit,
    };
  }

  // Search mode (optionally category-scoped)
  const words = q.split(/\s+/).filter(Boolean);

  const filtered = allProducts.filter((p) => {
    const name = (p.name ?? '').toLowerCase();
    const description = (p.description ?? '').toLowerCase();
    const matchesCategory = categoryFilter
      ? (p.category ?? '').toLowerCase() === categoryFilter
      : true;

    const matchesQuery =
      words.some((w) => name.includes(w) || description.includes(w)) ||
      name.includes(q) ||
      description.includes(q);

    return matchesCategory && matchesQuery;
  });

  return {
    products: filtered.slice(skip, skip + limit),
    total: filtered.length,
    skip,
    limit,
  };
}

// export async function searchProducts(query: string, limit = 5): Promise<ProductsResponse> {
//   const res = await fetch(`${BASE_URL}/products`, {
//     headers: {
//       'x-vercel-protection-bypass': BYPASS_TOKEN!,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to search products');
//   const json = await res.json();

//   // Split query into words for word matching
//   const words = query
//     .toLowerCase()
//     .split(/\s+/)
//     .filter(Boolean);

//   const filtered = json.data.filter((p: Product) => {
//     const name = p.name.toLowerCase();
//     const description = p.description.toLowerCase();
//     // Match if any word is in name or description
//     return (
//       words.some((word) => name.includes(word) || description.includes(word)) ||
//       name.includes(query.toLowerCase()) ||
//       description.includes(query.toLowerCase())
//     );
//   });

//   return {
//     products: filtered.slice(0, limit),
//     total: filtered.length,
//     skip: 0,
//     limit,
//   };
// }

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const json = await apiFetch('/products');
  return getProductsArray(json).filter(
    (product) => (product.category ?? '').toLowerCase() === category.toLowerCase(),
  );
}

export async function getPromotion() {
  const json = await apiFetch('/promotions');
  return json?.data ?? json;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
}

export async function getProductStock(id: string): Promise<number> {
  const json = await apiFetch(`/products/${id}/stock`);
  return Number(json?.data?.stock ?? json?.stock ?? 0);
}