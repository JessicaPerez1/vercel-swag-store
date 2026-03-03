'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryFilterProps {
  categories: { slug: string; name: string }[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname() || '/search';
  const searchParams = useSearchParams();

  const currentCategory = searchParams?.get('category') || '';

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams?.toString() || '');

    // Category mode should reset text search to avoid URL ping-pong with SearchForm
    params.delete('q');
    params.delete('skip');
    params.delete('page');

    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }

    const nextQs = params.toString();
    const nextUrl = nextQs ? `${pathname}?${nextQs}` : pathname;
    const currentUrl = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    if (nextUrl === currentUrl) return;

    router.replace(nextUrl);
  }

  return (
    <Select value={currentCategory || 'all'} onValueChange={handleChange}>
      <SelectTrigger className="w-48" aria-label="Filter by category">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.slug} value={cat.slug}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
