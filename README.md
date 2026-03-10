# vercel-swag-store

> Note: This app was built using [v0.app](https://v0.app).

## Getting Started

### Prerequisites
- Node.js **20+**
- npm **10+** (or compatible)

Check versions:
```bash
node -v
npm -v
```

### Clone the repository
```bash
git clone <your-repo-url>
cd vercel-swag-store
```

### Install dependencies
```bash
npm install
```

### Environment variables
Create local env file:

```bash
cp .env.example .env.local
```

If `.env.example` is not present, create `.env.local` manually and add required values for your setup.

### Start development server (Turbopack)
```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

### Build and run production locally
```bash
npm run build
npm start
```

---

## Available Scripts

- `npm run dev` – Start local development server (with Turbopack if configured)
- `npm run build` – Build production app
- `npm start` – Run production server
- `npm run lint` – Run lint checks

> Update this list if your `package.json` includes additional scripts (tests, format, etc.).

---

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [lucide-react](https://lucide.dev/) (icons)

---

## Project Wiki

Browse the internal project docs in `docs/wiki`:

- [Home](docs/wiki/Home.md)
- [Architecture](docs/wiki/Architecture.md)
- [Main Components](docs/wiki/Main%20Components.md)
- [Data Layer](docs/wiki/Data%20Layer.md)
- [Next.js 16 and Performance](docs/wiki/Next.js%2016%20and%20Performance.md)
- [Testing and Quality](docs/wiki/Testing%20and%20Quality.md)
- [Sidebar Nav](docs/wiki/_Sidebar.md)

---

## Turbopack + Lucide HMR Troubleshooting

If you see an error like:

`module factory is not available. It might have been deleted in an HMR update`

1. Ensure icons in client components use dynamic imports if needed.
2. Clear Next.js cache and restart:

```bash
rm -rf .next
npm run dev
```
## Next.js dev cache/build errors Troubleshooting

If you see errors like `routes-manifest.json` missing, `MODULE_NOT_FOUND`, or `.next/dev` write failures:

```bash
# 1) stop all running dev processes
pkill -f "next dev" || true
pkill -f "node.*next" || true

# 2) clean build/cache
rm -rf .next
rm -rf node_modules/.cache

# 3) If it still fails
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Project Architecture (Wiki Ready)

This project is a **Next.js 16 App Router storefront** with a hybrid Server/Client Component model.
The app prioritizes fast first render, cache-friendly data fetching, and client-side interactivity only where needed (cart, search controls, mobile nav).

### High-level structure

```text
app/
	layout.tsx                # Root layout, global metadata, viewport, analytics, providers
	page.tsx                  # Home route (hero, promo banner, featured products)
	search/page.tsx           # Search listing route
	products/[id]/page.tsx    # Product detail route
	api/products/route.ts     # API route proxy with revalidation/cache headers

components/
	site-header.tsx           # Header, cart trigger, mobile menu
	cart-sheet.tsx            # Cart drawer UI
	featured-products.tsx     # Server Component product grid
	search-results.tsx        # Server-side search + conditional rendering
	search-controls-client.tsx# Client-side URL/search controls
	product-card.tsx          # Product card UI with optimized image usage
	add-to-cart-form.tsx      # Add-to-cart interactions
	ui/*                      # Shared design system primitives (buttons, sheet, select, etc.)

lib/
	api.ts                    # Data access helpers and typed API interfaces
	server-api.ts             # Server-only fetch helpers (categories, product by id)
	cart-context.tsx          # Client cart state + sessionStorage persistence
```

### Main application flows

1. Home (`/`)
- Renders `PromoBanner`, `HeroSection`, and `FeaturedProducts`.
- Uses `Suspense` fallbacks for better perceived loading while data-heavy sections resolve.

2. Search (`/search`)
- Server renders the route and gets categories from `lib/server-api.ts`.
- `SearchControlsClient` updates query/category via URL state.
- `SearchResults` handles query/category/default modes and uses server data functions.

3. Product page (`/products/[id]`)
- Fetches product details server-side.
- Fetches live stock and passes it into `AddToCartForm`.
- Uses optimized `next/image` config and sizing for responsive delivery.

4. Cart
- Cart state lives in `CartProvider` (`lib/cart-context.tsx`).
- Persisted to `sessionStorage`.
- Cart drawer (`CartSheet`) is dynamically imported only when opened.

---

## Next.js 16 Features Used

### App Router + async route primitives
- File-based routing in `app/` with nested routes (`app/products/[id]/page.tsx`).
- Async `params` and `searchParams` usage in route components to align with modern App Router patterns.

### Server Components by default
- Pages and many data-driven components run server-side (`FeaturedProducts`, `SearchResults`, product page content).
- Keeps client bundles smaller by avoiding unnecessary client-side hydration.

### Client Components only where needed
- `SiteHeader`, cart context, and search controls are client components for interaction/state.
- Clear server/client boundary improves both performance and maintainability.

### Metadata and viewport APIs
- Root metadata is generated in `app/layout.tsx` via `generateMetadata()`.
- SEO defaults are pulled from API (`getStoreConfig`) and wired into Open Graph fields.
- `viewport` export centralizes responsive/device settings.

### Route Handlers and caching
- `app/api/products/route.ts` uses a Route Handler with `next: { revalidate: 60 }`.
- Response headers include `s-maxage` and `stale-while-revalidate` for CDN-friendly behavior.

### Config-level optimization flags
- `next.config.mjs` enables `cacheComponents: true`.
- `images.formats` includes AVIF/WebP and remote image allowlist for safe optimization.
- Long-lived immutable caching headers for `/_next/static/*` assets.

---

## Performance Strategy

### Data fetching and caching
- `lib/api.ts` defaults to `cache: 'force-cache'` in shared fetch helper.
- Store configuration and product lists are fetched with cache-friendly patterns.
- Search currently filters from fetched product sets in memory for responsive UX.

### Streaming and progressive rendering
- `Suspense` boundaries on home and search routes prevent blocking whole-page render.
- Skeleton placeholders improve perceived performance during async work.

### Bundle and hydration optimization
- Dynamic import in `components/site-header.tsx`:
	`CartSheet` is loaded only when cart is opened (`ssr: false`).
- Client-side JavaScript is limited to interactive UI; most content is server rendered.

### Image optimization
- Uses `next/image` with explicit dimensions and responsive `sizes`.
- Priority image loading on product detail hero image for LCP-sensitive content.
- AVIF/WebP configuration reduces payload size on supported browsers.

### Runtime UX optimizations
- Cart totals are memoized (`useMemo`) and handlers are stable (`useCallback`) in cart context.
- Cart persistence in `sessionStorage` avoids server round-trips for local state.

---

## Main Components Reference

- `components/site-header.tsx`: sticky header, nav links, cart trigger, mobile menu.
- `components/cart-sheet.tsx`: slide-out cart with item quantity controls.
- `components/featured-products.tsx`: server-rendered featured grid.
- `components/search-results.tsx`: server search/category/default logic.
- `components/search-controls-client.tsx`: client filter/search controls bound to URL.
- `components/product-card.tsx`: reusable product preview card across home/search.
- `components/add-to-cart-form.tsx`: quantity + stock-aware add-to-cart action.
- `lib/cart-context.tsx`: cart business logic and persistence layer.

---

## Quality and Testing

- Jest + Testing Library are configured (`jest.config.mjs`, `jest.setup.ts`).
- Existing tests cover key interactive behaviors:
	`__tests__/cart-context.test.tsx`, `__tests__/add-to-cart-form.test.tsx`, `__tests__/promo-banner.test.tsx`, and smoke checks.

This gives coverage across core UI flows and state management while keeping the app modular for future expansion (checkout, auth, inventory sync, etc.).
