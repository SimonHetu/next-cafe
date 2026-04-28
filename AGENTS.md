# AGENTS.md — next-cafe

## Stack

- Next.js 16.2.2 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4.2.2 + DaisyUI 5.5.19 (themes: retro, coffee)
- GSAP 3 + @gsap/react (ScrollTrigger, useGSAP)
- Prisma 7.7.0 (PostgreSQL via Neon adapter, client generated to `src/generated/prisma`)
- Clerk Next.js SDK 7.2.1 (auth + webhooks)
- Lucide React icons

## Environment

Copy `.env.exemple` to `.env` and fill:

- `DATABASE_URL` — PostgreSQL connection string (Neon)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SIGNING_SECRET`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/`

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run seed` — run `prisma/seed.ts` via tsx

## Path Aliases

`@/*` maps to project root. In practice imports use `@/src/...`.

## Database & Prisma

- Schema: `prisma/schema.prisma`
- Client output: `../src/generated/prisma`
- Adapter: `PrismaNeon` in `src/lib/prisma.ts`
- Models: `User`, `Product`, `FlavorNote`, `ProductFlavorNote`, `Order`, `Item`, `Address`
- Enums: `RoastLevel` (LIGHT, MEDIUM, DARK), `UserRole`, `OrderStatus`, `PaymentStatus`
- Price fields are `Decimal` (`@db.Decimal(10,2)`). Convert to number with `.toNumber()` when needed.

## Authentication

- Clerk handles UI and session. Pages: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` and `sign-up` equivalent.
- Webhook endpoint: `src/app/api/webhooks/route.ts` syncs Clerk events (`user.created`, `user.updated`, `user.deleted`) to the local `User` table.
- Layout wraps app in `<ClerkProvider>` + `<Header>`.

## Product Domain

- Service: `src/lib/products/product.service.ts` (server actions, `"use server"`). Provides `getProducts(origin, roast, orderBy)` and `getProductBySlug(slug)`.
- Types: `src/lib/products/product.types.ts` (CreateProductInput)
- Validation: `src/lib/products/product.validation.ts`
- API routes: `src/app/api/products/route.ts` (list) and `src/app/api/products/[slug]/route.ts` (single)
- Pages: `src/app/products/page.tsx` (list with filters) and `src/app/products/[slug]/page.tsx` (detail)

## UI / Components

- `src/components/Header.tsx` — top nav with Clerk buttons
- `src/components/ui/product-card.tsx` — card linking to `/products/:slug`
- `src/components/ui/product-filter.tsx` — client filter bar using GSAP animations
- `src/components/ui/roast-badge.tsx`, `price-tag.tsx`
- Animation components in `src/components/ui/animations/`: `fade-in-with-scroll.tsx`, `product-hero.tsx`, `product-details-3d.tsx`, `button.tsx`

## Conventions

- Server actions go in `src/lib/**` with `"use server"`
- API routes are thin wrappers around service functions
- Page components are async Server Components
- Components use `@/src/...` alias imports
- Decimal fields need `.toNumber()` before passing to UI props
- Tailwind config `content` currently points to `./app/**/*`; update if adding new component paths
