import { render, screen } from '@testing-library/react';
import React from 'react';
import { PromoBanner } from '@/components/promo-banner';

const mockGetPromotion = jest.fn();

jest.mock('@/lib/api', () => ({
  getPromotion: () => mockGetPromotion(),
}));

describe('PromoBanner', () => {
  beforeEach(() => {
    mockGetPromotion.mockReset();
  });

  it('returns null when promotion is inactive', async () => {
    mockGetPromotion.mockResolvedValue({ active: false });

    const result = await PromoBanner();

    expect(result).toBeNull();
  });

  it('hides code when description says no code needed', async () => {
    mockGetPromotion.mockResolvedValue({
      active: true,
      title: 'Spring Sale',
      description: 'Save 20% - No Code Needed today',
      code: 'SPRING20',
    });

    const result = await PromoBanner();
    render(result as React.ReactElement);

    expect(screen.getByText(/Spring Sale:/)).toBeInTheDocument();
    expect(screen.queryByText(/Code:/)).not.toBeInTheDocument();
    expect(screen.queryByText('SPRING20')).not.toBeInTheDocument();
  });

  it('shows code when description does not include no code needed', async () => {
    mockGetPromotion.mockResolvedValue({
      active: true,
      title: 'Spring Sale',
      description: 'Save 20% this week',
      code: 'SPRING20',
    });

    const result = await PromoBanner();
    render(result as React.ReactElement);

    expect(screen.getByText('Code:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('SPRING20')).toBeInTheDocument();
  });
});
