# Next.js App Router - Routing Documentation

This document describes the routing structure implemented using Next.js 14 App Router.

## Overview

The application uses Next.js 14's App Router (not React Router) for client-side and server-side routing. The App Router uses file-system based routing where the folder structure under `src/app/` defines the URL structure.

## Route Structure

```
/                           # Home page
├── /gospel                 # Daily Gospel reading
├── /learn                  # Educational content listing
│   └── /learn/[slug]       # Individual article pages (dynamic route)
└── /community              # Community features
```

## File Structure

```
src/app/
├── layout.tsx              # Root layout with Navigation
├── page.tsx                # Home page (/)
├── gospel/
│   └── page.tsx            # Gospel page (/gospel)
├── learn/
│   ├── page.tsx            # Learn listing (/learn)
│   └── [slug]/
│       └── page.tsx        # Article detail (/learn/[slug])
└── community/
    └── page.tsx            # Community page (/community)
```

## Navigation Component

The `Navigation` component (located at `src/components/common/Navigation.tsx`) provides:

- Fixed top navigation bar
- Active route highlighting
- Links to all main sections
- Responsive design

The Navigation component is included in the root layout and appears on all pages.

## Dynamic Routes

### Article Pages (`/learn/[slug]`)

Dynamic routes use square brackets in the folder name. The article detail page accepts a `slug` parameter and displays content based on that slug.

Example URLs:
- `/learn/understanding-real-presence`
- `/learn/biblical-foundation`
- `/learn/eucharistic-miracles`

## Key Features

### 1. Client-Side Navigation
- Uses Next.js `<Link>` component for optimized navigation
- Prefetches linked pages on hover
- No full page reloads

### 2. Server Components by Default
- All pages are React Server Components unless marked with `"use client"`
- The Navigation component uses `"use client"` for interactive features

### 3. Automatic Code Splitting
- Each route is automatically code-split
- Only loads JavaScript needed for the current page

### 4. Layouts
- Root layout includes Navigation and applies global styles
- Can create nested layouts for specific route segments

## Adding New Routes

### Static Route
1. Create a new folder under `src/app/`
2. Add a `page.tsx` file
3. Export a default React component

Example:
```typescript
// src/app/prayers/page.tsx
export default function PrayersPage() {
  return <div>Prayers Page</div>;
}
```

### Dynamic Route
1. Create a folder with square brackets: `[paramName]`
2. Add a `page.tsx` file that accepts params

Example:
```typescript
// src/app/articles/[id]/page.tsx
interface PageProps {
  params: {
    id: string;
  };
}

export default function ArticlePage({ params }: PageProps) {
  return <div>Article ID: {params.id}</div>;
}
```

## Route Metadata

Each page can export metadata for SEO:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Gospel',
  description: 'Read today\'s Gospel reading',
};

export default function GospelPage() {
  // ...
}
```

## Best Practices

1. **Use Link Component**: Always use `next/link` for internal navigation
2. **Server Components First**: Keep components as Server Components unless interactivity is needed
3. **Metadata**: Add appropriate metadata to each page for SEO
4. **Loading States**: Add `loading.tsx` files for route segment loading states
5. **Error Handling**: Add `error.tsx` files for error boundaries

## Related Documentation

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js Link Component](https://nextjs.org/docs/app/api-reference/components/link)

## Screenshots

Visual examples of the implemented routes can be found in `/docs/screenshots/`:

- `home-page.png` - Home page with navigation
- `gospel-page.png` - Daily Gospel reading page
- `learn-page.png` - Educational content listing
- `article-page.png` - Individual article detail page
- `community-page.png` - Community features page
