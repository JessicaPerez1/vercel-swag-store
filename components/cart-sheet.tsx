'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CartSheet() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-md" side="right">
      <SheetHeader>
        <SheetTitle className="text-lg">Shopping Cart</SheetTitle>
        <SheetDescription>
          {totalItems === 0
            ? 'Your cart is empty'
            : `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
        </SheetDescription>
      </SheetHeader>

      {totalItems === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            No items in your cart yet.
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 px-4">
            <div className="flex flex-col gap-4 py-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                    <Image
                      src={`/api/image-proxy?url=${encodeURIComponent(item.product.images[0])}`}
                      alt={item.product.name}
                      className="object-cover w-full h-auto"
                      width={80}
                      height={80}
                      priority
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-medium leading-tight text-foreground">
                        {item.product.name}
                      </h4>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                                            <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="flex w-8 items-center justify-center text-xs font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={typeof item.maxStock === 'number' && item.quantity >= item.maxStock}
                          className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <SheetFooter className="border-t border-border">
            <div className="flex w-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Subtotal</span>
                <span className="text-base font-semibold text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button className="w-full" size="lg">
                Checkout
              </Button>
            </div>
          </SheetFooter>
        </>
      )}
    </SheetContent>
  );
}
