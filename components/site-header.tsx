'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Triangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger} from '@/components/ui/sheet';

//Deferred cart drawer code until user opens cart: CartSheet is now dynamically imported (ssr: false) and only mounted when the sheet is open.
const CartSheet = dynamic(
  () => import('@/components/cart-sheet').then((mod) => mod.CartSheet),
  { ssr: false }
);

const SEARCH_LABEL = 'Search';

export function SiteHeader() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Triangle className="size-4 text-foreground fill-foreground" />
            <span className="text-lg font-semibold tracking-tight text-foreground">
            Swag Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
            Home
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
            {SEARCH_LABEL}
            </Link>
          </nav>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">

          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Open cart">
                <ShoppingBag className="size-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            {cartOpen ? <CartSheet /> : null}
          </Sheet>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-background px-4 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {SEARCH_LABEL}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
