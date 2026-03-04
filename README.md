# vercel-swag-store

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

````bash
# 1) stop all running dev processes
pkill -f "next dev" || true
pkill -f "node.*next" || true

# 2) clean build/cache
rm -rf .next
rm -rf node_modules/.cache

# 3) ensure folder is writable
mkdir -p .next/dev/cache
chmod -R u+rwX .next

# 3) If it still fails
rm -rf node_modules package-lock.json
npm install
npm run dev
