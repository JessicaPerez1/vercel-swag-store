import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCategories } from '@/lib/server-api';
import { SearchForm } from '@/components/search-form';
import { CategoryFilter } from '@/components/category-filter';
import { SearchResults } from '@/components/search-results';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Search Products',
  description:
    'Browse and search our full swag catalog. Filter by category to find exactly what you need.',
  openGraph: {
    title: 'Search Products | Swag Store',
    description:
      'Browse and search our full swag catalog. Filter by category to find exactly what you need.',
  },
};

function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-48" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-border"
          >
            <Skeleton className="aspect-square w-full" />
            <div className="p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

async function SearchPageContent({ searchParams }: SearchPageProps) {
  const { q, category } = await searchParams;
  const categories = await getCategories();

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {q ? `Results for "${q}"` : 'All Products'}
          </h1>
          <p className="text-base text-muted-foreground">
            {q
              ? 'Showing matching products from our catalog.'
              : 'Browse our full collection of products.'}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Suspense>
              <SearchForm />
            </Suspense>
          </div>
          <Suspense>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        <Suspense fallback={<ResultsSkeleton />}>
          <SearchResults query={q} category={category} />
        </Suspense>
      </div>
    </div>
  );
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <SearchPageContent {...props} />
    </Suspense>
  );
}