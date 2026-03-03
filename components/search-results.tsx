import {
  searchProducts,
  getProducts,
  getProductsByCategory,
  type Product,
} from '@/lib/api';
import { ProductCard } from './product-card';

interface SearchResultsProps {
  query?: string;
  category?: string;
}

export async function SearchResults({ query, category }: SearchResultsProps) {
  let products: Product[] = [];
  let total = 0;

  if (query?.trim()) {
    // Search mode: first 5 + search total
    const data = await searchProducts(query, 5, 0, category);
    products = data.products;
    total = data.total;
  } else if (category?.trim()) {
    // Category-only mode: first 5 in category + category total
    const data = await getProductsByCategory(category);
    products = data.slice(0, 5);
    total = data.length;
  } else {
    // Default catalog mode (keep your existing behavior)
    const data = await getProducts(10, 0);
    products = data.products;
    total = data.total;
  }

  if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-16">
          <p className="text-lg font-medium text-foreground">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter to find what you are looking for.
          </p>
        </div>
      )
    }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {products.length} out of {total} products
        {query ? ` for "${query}"` : ''}
        {category ? ` in ${category}` : ''}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
