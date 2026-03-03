import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-balance font-serif text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-7xl">
            Wear the framework you ship with.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-black/70 lg:text-lg">
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
      </div>

      {/* Decorative element */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
    </section>
  );
}
