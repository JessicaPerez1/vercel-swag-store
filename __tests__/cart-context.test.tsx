import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '@/lib/cart-context';

const product = {
  id: 'p-1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'A test product',
  price: 1000,
  currency: 'USD',
  category: 'gear',
  images: ['https://example.com/image.png'],
  tags: [],
  featured: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

function CartHarness() {
  const {
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <div>
      <button type="button" onClick={() => addItem(product, 2, 3)}>
        add-two
      </button>
      <button type="button" onClick={() => addItem(product, 2, 3)}>
        add-two-again
      </button>
      <button type="button" onClick={() => updateQuantity(product.id, 5)}>
        update-five
      </button>
      <button type="button" onClick={() => removeItem(product.id)}>
        remove
      </button>
      <button type="button" onClick={clearCart}>
        clear
      </button>

      <div>qty:{getItemQuantity(product.id)}</div>
      <div>totalItems:{totalItems}</div>
      <div>totalPrice:{totalPrice}</div>
    </div>
  );
}

describe('cart-context', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('adds items, caps quantity by maxStock, and updates totals', () => {
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('add-two'));
    expect(screen.getByText('qty:2')).toBeInTheDocument();
    expect(screen.getByText('totalItems:2')).toBeInTheDocument();
    expect(screen.getByText('totalPrice:2000')).toBeInTheDocument();

    fireEvent.click(screen.getByText('add-two-again'));
    expect(screen.getByText('qty:3')).toBeInTheDocument();
    expect(screen.getByText('totalItems:3')).toBeInTheDocument();
    expect(screen.getByText('totalPrice:3000')).toBeInTheDocument();

    fireEvent.click(screen.getByText('update-five'));
    expect(screen.getByText('qty:3')).toBeInTheDocument();
  });

  it('removes and clears items', () => {
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('add-two'));
    expect(screen.getByText('qty:2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('remove'));
    expect(screen.getByText('qty:0')).toBeInTheDocument();
    expect(screen.getByText('totalItems:0')).toBeInTheDocument();

    fireEvent.click(screen.getByText('add-two'));
    fireEvent.click(screen.getByText('clear'));
    expect(screen.getByText('qty:0')).toBeInTheDocument();
    expect(screen.getByText('totalItems:0')).toBeInTheDocument();
    expect(screen.getByText('totalPrice:0')).toBeInTheDocument();
  });
});
