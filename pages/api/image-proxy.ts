import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imageUrl = req.query.url as string;
  if (!imageUrl) {
    res.status(400).send('Missing image URL');
    return;
  }

  const imageRes = await fetch(imageUrl);
  const buffer = await imageRes.arrayBuffer();

  res.setHeader('Cache-Control', 'public, max-age=31536000, stale-while-revalidate=86400');
  res.setHeader('Content-Type', imageRes.headers.get('content-type') || 'image/jpeg');
  res.status(200).send(Buffer.from(buffer));
}