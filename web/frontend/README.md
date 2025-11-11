# Eucharist Web Frontend

Next.js 14-based web frontend with TypeScript, Tailwind CSS, Zustand, and React Query.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **Axios** - HTTP client

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── common/          # Shared components (Providers, Layout)
│   ├── eucharist/       # Eucharist-specific components
│   ├── gospel/          # Gospel reading components
│   └── community/       # Community feature components
├── hooks/               # Custom React hooks (useAuth, etc.)
├── services/            # API services (api.ts)
├── store/               # Zustand stores (userStore.ts)
├── styles/              # Additional styles
└── utils/               # Utility functions (formatters.ts)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

From the frontend directory:

```bash
npm install
```

Or from the root directory (installs all workspaces):

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Environment Variables

Create a `.env.local` file in the frontend directory (see `.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Eucharist Platform
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (currently has configuration conflicts with root config)
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run test` - Run tests (to be implemented)
- `npm run test:watch` - Run tests in watch mode

## State Management

### Zustand Stores

Located in `src/store/`:

- `userStore.ts` - User authentication state

Example usage:

```typescript
import { useUserStore } from "@/store/userStore";

function MyComponent() {
  const { user, isAuthenticated, setUser, logout } = useUserStore();
  // ...
}
```

## Data Fetching

### React Query

Configured in `src/components/common/Providers.tsx` with default options:

- `staleTime`: 60 seconds
- `refetchOnWindowFocus`: disabled

Example usage:

```typescript
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["key"],
    queryFn: () => apiClient.get("/endpoint").then((res) => res.data),
  });
  // ...
}
```

## API Integration

API client is configured in `src/services/api.ts`:

- Base URL from environment variable
- Automatic JWT token injection
- 401 redirect to login
- TypeScript-ready axios instance

## Code Style

This project follows:

- Next.js conventions for file organization
- TypeScript strict mode
- Tailwind CSS for styling
- Functional components with hooks

## Known Issues

- ESLint configuration has conflicts with root-level ESLint config. ESLint is temporarily disabled during builds. This needs to be resolved by properly configuring workspace-specific ESLint settings.

## Future Enhancements

- Add Jest and React Testing Library for testing
- Add Playwright for E2E tests
- Implement internationalization (i18next)
- Add more comprehensive component library
- Implement authentication flows
- Add API service layer for all endpoints

## Contributing

See the root [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.
