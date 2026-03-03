'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchForm() {
  const router = useRouter();
  const pathname = usePathname() || '/search';
  const searchParams = useSearchParams();

  const paramsString = searchParams?.toString() || '';
  const currentQ = searchParams?.get('q') || '';

  const [query, setQuery] = useState(currentQ);
  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNavRef = useRef<string>('');
  const skipDebounceRef = useRef(false);

  useEffect(() => {
    setQuery(currentQ);
    skipDebounceRef.current = true; // prevent debounce after URL-driven sync

    const currentUrl = paramsString ? `${pathname}?${paramsString}` : pathname;
    lastNavRef.current = currentUrl;
    setIsLoading(false);
  }, [currentQ, paramsString, pathname]);

  const buildNextUrl = useCallback(
    (raw: string) => {
      const nextQ = raw.trim();
      const params = new URLSearchParams(paramsString);

      if (nextQ) {
        params.set('q', nextQ);
        params.delete('category');
        params.delete('skip');
        params.delete('page');
      } else {
        params.delete('q');
      }

      const nextQs = params.toString();
      return nextQs ? `${pathname}?${nextQs}` : pathname;
    },
    [paramsString, pathname]
  );

  const navigateIfNeeded = useCallback(
    (raw: string, showLoading: boolean) => {
      const nextUrl = buildNextUrl(raw);
      const currentUrl = paramsString ? `${pathname}?${paramsString}` : pathname;

      if (nextUrl === currentUrl) return;
      if (nextUrl === lastNavRef.current) return;

      lastNavRef.current = nextUrl;
      if (showLoading) setIsLoading(true);
      router.replace(nextUrl);
    },
    [buildNextUrl, paramsString, pathname, router]
  );

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const nextQ = query.trim();
    if (nextQ.length >= 3 && nextQ !== currentQ) {
      debounceRef.current = setTimeout(() => {
        navigateIfNeeded(nextQ, false); // no button spinner for debounce
      }, 400);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, currentQ, navigateIfNeeded]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigateIfNeeded(query, true); // spinner only on submit
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value === '') navigateIfNeeded('', false);
          }}
          className="pl-9"
          aria-label="Search products"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Search'}
      </Button>
    </form>
  );
}
