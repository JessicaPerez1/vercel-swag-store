'use cache';

import { getPromotion } from '@/lib/api';

export async function PromoBanner() {
  const promo = await getPromotion();
  if (!promo?.active) return null;

  const description = promo.description ?? '';
  const shouldShowCode =
    Boolean(promo.code) && !description.toLowerCase().includes('no code needed');

  return (
    <div className="bg-black text-white">
      <div className="mx-auto flex items-center justify-center gap-2 px-4 py-3 text-center text-sm font-medium lg:px-8">
        <span>
          {promo.title}: {description}
          {shouldShowCode ? <span> Code: <strong>{promo.code}</strong></span> : ''}
        </span>
      </div>
    </div>
  );
}
