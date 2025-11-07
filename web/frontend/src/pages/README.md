# Page Components

This directory contains top-level page components for Next.js routing.

## Structure

```
pages/
├── index.tsx                # Home/landing page
├── gospel.tsx              # Daily gospel page
├── learn/                  # Educational content pages
├── miracles.tsx            # Eucharistic miracles
├── community/              # Community pages
├── profile.tsx             # User profile
└── about.tsx              # About page
```

## Next.js Conventions

- File-based routing (filename = route)
- Use `getStaticProps` for static generation
- Use `getServerSideProps` for dynamic data
- Implement proper SEO with `next/head`
- Handle loading and error states
