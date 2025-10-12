# img-to-palette

🎨 Extract color palettes from any image and find the nearest Tailwind CSS colors for seamless design integration.

**[Try it live →](https://img-to-palette.ras.sh)**

## Features

- **Smart color extraction** — extracts dominant colors using Vibrant's color quantization algorithm
- **Tailwind color matching** — finds the 3 closest Tailwind CSS colors for each extracted color
- **Multiple export formats** — HEX, RGB, HSL, OKLCH, CSS Variables, and Tailwind classes
- **Drag & drop interface** — supports JPEG, PNG, GIF, and WebP images
- **One-click copying** — copy colors in your preferred format with a single click

## Tech Stack

Built with [TanStack Start](https://tanstack.com/start) and powered by [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) for color extraction and [culori](https://github.com/Evercoder/culori) for color conversion and CIEDE2000 color matching.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and guidelines.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
