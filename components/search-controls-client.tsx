'use client';

import { SearchForm } from '@/components/search-form';
import { CategoryFilter } from '@/components/category-filter';

interface SearchControlsClientProps {
  categories: { slug: string; name: string }[];
}

export function SearchControlsClient({ categories }: SearchControlsClientProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-lg bg-gray-100 p-4 text-foreground dark:bg-gray-800 sm:flex-row sm:items-end">
      <div className="flex-1">
        <SearchForm />
      </div>
      <CategoryFilter categories={categories} />
    </div>
  );
}
