# @ras-sh/template-tanstack-start

🚀 Full-stack template with TanStack Start. Includes SSR, file-based routing, and modern tooling.

## Features

- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework with SSR
- **TypeScript** - End-to-end type safety
- **Tailwind CSS v4** + **@ras-sh/ui** - Modern styling and components

## Quick Start

```bash
pnpm install
pnpm dev
```

## Building Your App

1. Build routes in `src/routes/` with SSR loaders
2. Add components in `src/components/`
3. Update `package.json` and branding assets

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (port 5173) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm check-types` | Run TypeScript type checking |
| `pnpm check` | Run linter checks |
| `pnpm fix` | Auto-fix linting issues |

## Project Structure

```
src/
├── routes/         # File-based routing with SSR loaders
├── components/     # Reusable components
├── lib/            # Utilities (SEO helper, etc.)
└── router.tsx      # Router configuration
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.
