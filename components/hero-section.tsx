import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProduct } from '@/lib/server-api';

export async function HeroSection() {
  const product = await getProduct('tshirt_001');
  const heroImage = product.images?.[0] ?? '';

  return (
    <section className="relative overflow-hidden bg-white py-8 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <h1 className="mx-auto max-w-2xl text-balance font-serif text-4xl font-bold tracking-tight text-black sm:text-5xl lg:mx-0 lg:text-7xl">
              Wear the framework you ship with.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-black/70 lg:mx-0 lg:text-lg">
              Premium swag for developers who build with Vercel. From tees to tech gear, represent the tools you love.
            </p>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="mt-10 border-black bg-black text-white hover:bg-gray-300 hover:text-black"
            >
              <Link href="/search">
                Browse all products
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          <div className="relative mx-auto w-full max-w-[7.50rem] sm:max-w-[9rem] md:max-w-[10rem] lg:max-w-[15rem]">
            <Link
              href={`/products/${product.id}`}
              aria-label={`View ${product.name || 'Black Crewneck T-Shirt'} details`}
              className="block rounded-2xl transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50 p-4 lg:p-6">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={product.name || 'Black Crewneck T-Shirt'}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 32vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black/60">
                    Hero image unavailable
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
    </section>
  );
}
