# Tailwind CSS Configuration

This document describes the Tailwind CSS configuration for the Eucharist Platform frontend.

## Overview

The Tailwind CSS configuration has been set up according to ADR-006 specifications with:

- Autoprefixer for cross-browser compatibility
- Custom theme colors for brand consistency
- Extended utilities for flexible layout options
- Dark mode support

## Configuration Files

### 1. `tailwind.config.ts`

Main Tailwind configuration file with custom theme extensions.

### 2. `postcss.config.mjs`

PostCSS configuration including Tailwind and Autoprefixer plugins.

### 3. `src/app/globals.css`

Global styles with Tailwind directives.

## Custom Theme

### Colors

#### Primary (Blue)

Used for main actions, links, and branding elements.

```tsx
<button className="bg-primary-500 hover:bg-primary-600">Click me</button>
```

- `primary-50` through `primary-950` (11 shades)

#### Secondary (Purple)

Used for secondary actions and supporting elements.

```tsx
<div className="bg-secondary-100 text-secondary-800">Info box</div>
```

- `secondary-50` through `secondary-950` (11 shades)

#### Accent (Pink/Magenta)

Used for highlights, special calls-to-action, and emphasis.

```tsx
<span className="text-accent-600">Important!</span>
```

- `accent-50` through `accent-950` (11 shades)

### Typography

#### Font Families

- **Sans**: Geist Sans variable font (default)
  ```tsx
  <p className="font-sans">Body text</p>
  ```
- **Mono**: Geist Mono variable font (for code)
  ```tsx
  <code className="font-mono">const x = 42;</code>
  ```

### Extended Utilities

#### Spacing

- `h-128` / `w-128`: 32rem (512px)
- `h-144` / `w-144`: 36rem (576px)

```tsx
<div className="h-128">Tall container</div>
```

#### Border Radius

- `rounded-4xl`: 2rem (32px)

```tsx
<div className="rounded-4xl">Very rounded corners</div>
```

#### Max Width

- `max-w-8xl`: 88rem (1408px)
- `max-w-9xl`: 96rem (1536px)

```tsx
<div className="max-w-9xl mx-auto">Wide container</div>
```

## Dark Mode

Dark mode is configured to use CSS media queries:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

Tailwind classes automatically adapt based on system preference:

```tsx
<div className="bg-white dark:bg-gray-900">Content adapts to system theme</div>
```

## Content Paths

Tailwind scans the following directories for class usage:

- `src/pages/**/*.{js,ts,jsx,tsx,mdx}`
- `src/components/**/*.{js,ts,jsx,tsx,mdx}`
- `src/app/**/*.{js,ts,jsx,tsx,mdx}`
- `src/hooks/**/*.{js,ts,jsx,tsx}`
- `src/services/**/*.{js,ts,jsx,tsx}`
- `src/store/**/*.{js,ts,jsx,tsx}`
- `src/utils/**/*.{js,ts,jsx,tsx}`

## Autoprefixer

Autoprefixer automatically adds vendor prefixes for:

- Flexbox properties
- Grid layout
- Transform properties
- Appearance properties
- And more...

Example output:

```css
/* Input */
.element {
  transform: rotate(45deg);
}

/* Output */
.element {
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
```

## Usage Examples

### Button with Primary Color

```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg">
  Submit
</button>
```

### Card with Custom Styling

```tsx
<div className="max-w-8xl mx-auto bg-white rounded-4xl shadow-lg p-8">
  <h2 className="text-2xl font-bold text-primary-700">Card Title</h2>
  <p className="text-gray-600">Card content goes here</p>
</div>
```

### Hero Section with Extended Spacing

```tsx
<section className="h-128 flex items-center justify-center bg-gradient-to-r from-primary-500 to-secondary-500">
  <h1 className="text-5xl font-bold text-white">Welcome</h1>
</section>
```

### Responsive Layout

```tsx
<div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/* Grid items */}</div>
</div>
```

## Best Practices

1. **Use semantic colors**: Choose `primary` for main actions, `secondary` for supporting actions, `accent` for emphasis.

2. **Responsive design**: Always consider mobile-first and use responsive variants (`sm:`, `md:`, `lg:`, `xl:`).

3. **Consistent spacing**: Use Tailwind's spacing scale for consistency (`p-4`, `m-8`, etc.).

4. **Avoid arbitrary values**: Use theme values instead of arbitrary values when possible.

5. **Compose utilities**: Prefer composition over custom CSS:

   ```tsx
   // Good
   <div className="flex items-center space-x-4">

   // Avoid
   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
   ```

## Build Optimization

Tailwind automatically:

- Removes unused CSS in production builds
- Minifies the output
- Optimizes for performance

Production build size is optimized to only include classes actually used in the application.

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Autoprefixer Documentation](https://github.com/postcss/autoprefixer)
- [Project ADR-006](../../docs/architecture/adr/ADR-006-sprint-1-tech-stack.md)

## Troubleshooting

### Classes not applying

1. Check if the file is in a content path
2. Ensure the class name is correct
3. Clear `.next` cache and rebuild

### Build errors

1. Verify `tailwindcss` and `autoprefixer` are installed
2. Check PostCSS configuration
3. Ensure `globals.css` has Tailwind directives

### Hot reload not working

1. Restart the dev server
2. Check if the file is being watched
3. Verify content paths in config
