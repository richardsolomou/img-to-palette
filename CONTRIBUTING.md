# Contributing to img-to-palette

Thank you for your interest in contributing! This guide will help you get started with development.

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
git clone https://github.com/richardsolomou/img-to-palette.git
cd img-to-palette
pnpm install
```

### Development Commands

```bash
# Start development server
pnpm dev

# Format, lint, build, type check, and test
pnpm check

# Fix formatting and linting issues
pnpm fix

# Build for production
pnpm build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run all checks: `pnpm check`
5. Submit a pull request

### Code Quality

This project uses:

- **TypeScript**: Strict type checking
- **Oxlint and Oxfmt**: Linter and formatter
- **TanStack Start**: React framework
- **Tailwind CSS**: Utility-first CSS

## License

MIT - see [LICENSE](LICENSE) file for details.
