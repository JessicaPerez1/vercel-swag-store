import { render, screen, fireEvent } from '@testing-library/react';
import { AddToCartForm } from '@/components/add-to-cart-form';
import type { CartItem } from '@/lib/cart-context';

const mockUseCart = jest.fn();

jest.mock('@/lib/cart-context', () => ({
  useCart: () => mockUseCart(),
}));

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

function setCartState(items: CartItem[] = [], addItem = jest.fn()) {
  mockUseCart.mockReturnValue({
    items,
    addItem,
  });
  return addItem;
}

describe('AddToCartForm', () => {
  beforeEach(() => {
    mockUseCart.mockReset();
  });

  it('shows out-of-stock state and disables add button', () => {
    setCartState();

    render(<AddToCartForm product={product} stock={0} />);

    expect(screen.getAllByText(/^Out of Stock$/)).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
  });

  it('adds selected quantity with stock cap', () => {
    const addItem = setCartState();

    render(<AddToCartForm product={product} stock={5} />);

    fireEvent.click(screen.getByLabelText('Increase quantity'));
    fireEvent.click(screen.getByLabelText('Increase quantity'));
    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

    expect(addItem).toHaveBeenCalledWith(product, 3, 5);
  });

  it('shows max quantity reached when cart already has full stock', () => {
    const items: CartItem[] = [
      { product, quantity: 5, maxStock: 5 },
    ];
    setCartState(items);

    render(<AddToCartForm product={product} stock={5} />);

    expect(screen.getByText('Max quantity in cart')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Max stock reached' })).toBeDisabled();
  });
});
