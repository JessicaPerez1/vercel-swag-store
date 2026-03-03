import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/lib/api';

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={`/api/image-proxy?url=${encodeURIComponent(product.images[0])}`}
          alt={product.name}
          className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 800px) 100vw, 772px"
          width={772}
          height={772}
          fetchPriority="high"
          priority
        />
        {/* {product.discountPercentage > 10 && (
          <span className="absolute top-3 left-3 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
            -{Math.round(product.discountPercentage)}%
          </span>
        )} */}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="line-clamp-1 text-sm font-medium text-foreground">
          {product.name}
        </p>
        <p className="text-sm font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
