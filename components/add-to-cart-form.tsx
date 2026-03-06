'use client';

import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/api';

interface AddToCartFormProps {
  product: Product;
  stock: number;
}

export function AddToCartForm({ product, stock }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, items } = useCart();

  const safeStock = Number.isFinite(Number(stock)) ? Math.max(0, Number(stock)) : 0;
  const productId = String(product.id);

  const inCartQty = items.reduce(
    (sum, i) => (String(i.product.id) === productId ? sum + i.quantity : sum),
    0
  );

  const remainingStock = Math.max(0, safeStock - inCartQty);
  const isOutOfStock = safeStock <= 0;
  const isMaxReached = remainingStock <= 0;

  useEffect(() => {
    if (isMaxReached) setQuantity(1);
    else if (quantity > remainingStock) setQuantity(remainingStock);
  }, [isMaxReached, quantity, remainingStock]);

  const handleAdd = () => {
    if (isOutOfStock || isMaxReached) return;
    addItem(product, Math.min(quantity, remainingStock), safeStock);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stock indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block size-2 rounded-full ${
            safeStock > 10 ? 'bg-green-500' : safeStock > 0 ? 'bg-yellow-500' : 'bg-destructive'
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {isOutOfStock
            ? 'Out of Stock'
            : isMaxReached
              ? 'Max quantity in cart'
              : safeStock <= 10
                ? `Only ${safeStock} left in stock`
                : `${safeStock} in stock`}
        </span>
      </div>
      
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <div className="flex items-center rounded-md border border-border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock || isMaxReached || quantity <= 1}
            className="flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="flex w-12 items-center justify-center text-sm font-medium text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(remainingStock, q + 1))}
            disabled={isOutOfStock || isMaxReached || quantity >= remainingStock}
            className="flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        type="button"
        size="lg"
        className="w-full mt-2"
        disabled={isOutOfStock || isMaxReached}
        onClick={handleAdd}
      >
        <ShoppingBag className="mr-2 size-4" />
        {added ? 'Added to Cart' : isOutOfStock ? 'Out of Stock' : isMaxReached ? 'Max stock reached' : 'Add to Cart'}
      </Button>
    </div>
  );
}
