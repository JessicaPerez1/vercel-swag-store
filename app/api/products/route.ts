import { NextResponse } from 'next/server';

const BASE_URL = 'https://vercel-swag-store-api.vercel.app/api';
const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.max(1, Number(searchParams.get('limit') ?? 10));
  const skip = Math.max(0, Number(searchParams.get('skip') ?? 0));
  const page = Math.floor(skip / limit) + 1;

  const upstream = await fetch(`${BASE_URL}/products?page=${page}&limit=${limit}`, {
    headers: BYPASS_TOKEN
      ? { 'x-vercel-protection-bypass': BYPASS_TOKEN }
      : undefined,
    next: { revalidate: 60 },
  });

  const raw = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json({ error: `Upstream ${upstream.status}`, raw }, { status: 500 });
  }

  const products = Array.isArray(raw?.data) ? raw.data : [];
  const total = Number(raw?.meta?.pagination?.total ?? products.length);

  return NextResponse.json(
    { products, total },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  );
}
