import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = product.images?.[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            width={772}
            height={772}
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="line-clamp-1 text-sm font-medium text-foreground">{product.name}</p>
        <p className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
