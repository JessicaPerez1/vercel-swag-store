import { Suspense } from 'react';
import { HeroSection } from '@/components/hero-section';
import { PromoBanner } from '@/components/promo-banner';
import { FeaturedProducts } from '@/components/featured-products';
import { Skeleton } from '@/components/ui/skeleton';

function ProductGridSkeleton() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-3 h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBannerSkeleton() {
  return (
    <div className="bg-secondary">
      <div className="mx-auto flex items-center justify-center px-4 py-3">
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<PromoBannerSkeleton />}>
        <PromoBanner />
      </Suspense>
      <HeroSection />
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </>
  );
}
