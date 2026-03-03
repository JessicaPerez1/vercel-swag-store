'use cache';

import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';

export async function FeaturedProducts() {
  const data = await getFeaturedProducts(6);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-row justify-between text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Featured Products
          </h2>
          <Button
            variant="link"
            size="lg"
            asChild
            className="text-gray-700 hover:text-black"
          >
            <Link href="/search">
                View All
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((product) => (
            <ProductCard key={product.id} product={product}/>
          ))}
        </div>
      </div>
    </section>
  );
}
