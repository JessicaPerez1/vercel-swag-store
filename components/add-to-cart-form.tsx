'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/api';

interface AddToCartFormProps {
  product: Product
  stock: number
}

export function AddToCartForm({ product, stock }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const isOutOfStock = stock <= 0;

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stock indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block size-2 rounded-full ${
            stock > 10
              ? 'bg-green-500'
              : stock > 0
                ? 'bg-yellow-500'
                : 'bg-destructive'
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {isOutOfStock
            ? 'Out of Stock'
            : stock <= 10
              ? `Only ${stock} left in stock`
              : `${stock} in stock`}
        </span>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <div className="flex items-center rounded-md border border-border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock || quantity <= 1}
            className="flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="flex w-12 items-center justify-center text-sm font-medium text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={isOutOfStock || quantity >= stock}
            className="flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        size="lg"
        className="w-full mt-2"
        disabled={isOutOfStock}
        onClick={handleAdd}
      >
        <ShoppingBag className="mr-2 size-4" />
        {added ? 'Added to Cart' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}
