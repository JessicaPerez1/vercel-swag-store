import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProduct } from '@/lib/server-api';
import { formatPrice, getProductStock } from '@/lib/api';
import { AddToCartForm } from '@/components/add-to-cart-form';
import { Badge } from '@/components/ui/badge';

interface ProductPageProps {
  params: Promise<{ id: string }>
}

async function ProductPageContent({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  const productStock = await getProductStock(id);

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/search" className="transition-colors hover:text-foreground">
            Search
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
            <Image
              src={`/api/image-proxy?url=${encodeURIComponent(product.images[0])}`}
              alt={product.name || product.description   || (product.category ? `Product in category ${product.category}` : 'Product image')}
              width={638}
              height={638}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 638px"
              className="w-full h-auto object-cover"
              fetchPriority="high"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                {product.name}
              </h1>

              <p className="text-2xl font-semibold text-foreground">
                {formatPrice(product.price)}
              </p>

              {/* {product.discountPercentage > 0 && (
                <p className="text-sm text-muted-foreground">
                  Save {Math.round(product.discountPercentage)}% today
                </p>
              )} */}
            </div>

            <div className="my-6 h-px bg-border" />

            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="my-6 h-px bg-border" />

            <AddToCartForm product={product}
            stock={productStock} />

          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage(props: ProductPageProps) {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductPageContent {...props} />
    </Suspense>
  );
}