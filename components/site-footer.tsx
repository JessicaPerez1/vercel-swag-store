import Link from 'next/link';
import { getStoreConfig } from '@/lib/api';
import { CurrentYear } from './current-year';

export default async function SiteFooter() {
  const config = await getStoreConfig().catch(() => null);

  const social = config?.socialLinks ?? {
    twitter: 'https://twitter.com/vercel',
    github: 'https://github.com/vercel',
    discord: 'https://discord.gg/vercel',
  };

  return (
    <footer className="border-t py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © <CurrentYear /> {config?.storeName ?? 'Vercel Swag Store'} All rights reserved.
        </p>

        <nav
          aria-label="Social links"
          className="flex flex-wrap items-center justify-center gap-4 text-sm"
        >
          <Link
            href={social.twitter}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open Twitter in a new tab"
            className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Twitter ↗
          </Link>

          <Link
            href={social.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open GitHub in a new tab"
            className="font-semibold text-foreground underline underline-offset-4 hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            GitHub ↗
          </Link>

          <Link
            href={social.discord}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open Discord in a new tab"
            className="font-semibold text-indigo-600 underline underline-offset-4 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Discord ↗
          </Link>
        </nav>
      </div>
    </footer>
  );
}
